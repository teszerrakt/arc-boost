// Arc Boost Script: Adds a blue "Jump to current sprint" button at bottom right
(() => {
  'use strict';
  
  const CONFIG = {
    BUTTON_ID: 'arc-boost-sprint-jump-button',
    RESTORE_BUTTON_ID: 'arc-boost-restore-button',
    BUTTON_CLASS: 'arc-boost-sprint-btn',
    RESTORE_BUTTON_CLASS: 'arc-boost-restore-btn',
    FLASH_CLASS: 'arc-boost-sprint-flash-effect',
    THANOS_CLASS: 'arc-boost-thanos-snap',
    FLASH_DURATION: 1200,
    FLASH_DELAY: 450,
    THANOS_DURATION: 1500,
    INSERTION_DELAYS: [0, 100, 500, 1000]
  };

  const log = (message, ...args) => console.log(`[ARC BOOST] ${message}`, ...args);

  const getMondayString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    return [
      monday.getFullYear(),
      String(monday.getMonth() + 1).padStart(2, '0'),
      String(monday.getDate()).padStart(2, '0')
    ].join('-');
  };

  const flashElement = (el) => {
    el.classList.add(CONFIG.FLASH_CLASS);
    setTimeout(() => el.classList.remove(CONFIG.FLASH_CLASS), CONFIG.FLASH_DURATION);
  };

  const scrollAndFlash = (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => flashElement(element), CONFIG.FLASH_DELAY);
  };

  const getAllSprintSections = () => {
    // Find sprint containers and divider elements
    const sprintContainers = Array.from(document.querySelectorAll('div[data-testid^="software-backlog.card-list.container."]'));
    const dividerContainers = Array.from(document.querySelectorAll('div[data-testid="software-backlog.card-list.divider.container"]'));
    
    log(`Found ${sprintContainers.length} sprint containers and ${dividerContainers.length} divider containers`);
    
    // Log each container for debugging
    sprintContainers.forEach((container, index) => {
      const headers = container.querySelectorAll('h2');
      const sprintName = Array.from(headers)[0]?.textContent.trim() || 'No header found';
      log(`Sprint container ${index + 1}: "${sprintName}"`);
    });
    
    dividerContainers.forEach((container, index) => {
      log(`Divider container ${index + 1}: Found divider element`);
    });
    
    // Combine both types of containers
    const allContainers = [...sprintContainers, ...dividerContainers];
    log(`Total containers to manage: ${allContainers.length}`);
    
    return allContainers;
  };

  let snappedSections = [];

  const thanosSnapOtherSections = (currentSprintElement) => {
    const allSprints = getAllSprintSections();
    const otherSprints = allSprints.filter(sprint => sprint !== currentSprintElement);
    
    log(`Found ${allSprints.length} total sprint sections, snapping ${otherSprints.length} others`);
    
    snappedSections = [...otherSprints]; // Store for restoration
    
    otherSprints.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add(CONFIG.THANOS_CLASS);
        log(`Snapping section ${index + 1}/${otherSprints.length}`);
      }, index * 200); // Stagger the animations
    });
    
    // Clean up after animation completes
    setTimeout(() => {
      otherSprints.forEach(section => {
        section.style.display = 'none';
      });
      log('Thanos snap complete - other sections hidden');
      showRestoreButton();
    }, CONFIG.THANOS_DURATION + (otherSprints.length * 200));
  };

  const restoreSnappedSections = () => {
    log(`Restoring ${snappedSections.length} snapped sections`);
    
    snappedSections.forEach((section, index) => {
      setTimeout(() => {
        section.style.display = '';
        section.classList.remove(CONFIG.THANOS_CLASS);
        log(`Restored section ${index + 1}/${snappedSections.length}`);
      }, index * 100);
    });
    
    snappedSections = [];
    hideRestoreButton();
    log('All sections restored');
  };

  const findCurrentSprintContainer = () => {
    const sprintText = `Web Sprint ${getMondayString()}`;
    log('Looking for:', sprintText);
    
    // Find all sprint containers using the data-testid pattern
    const allContainers = Array.from(document.querySelectorAll('div[data-testid^="software-backlog.card-list.container."]'));
    
    // Look for current week's sprint in each container
    for (const container of allContainers) {
      const headers = container.querySelectorAll('h2');
      
      for (const h2 of headers) {
        const text = h2.textContent.trim();
        if (text === sprintText) {
          log(`Found current sprint container: "${text}"`);
          return container;
        }
      }
    }
    
    log('Current sprint container not found');
    return null;
  };

  const scrollToCurrentWeekWebSprint = () => {
    const currentSprintContainer = findCurrentSprintContainer();
    
    if (currentSprintContainer) {
      scrollAndFlash(currentSprintContainer);
      
      // Trigger Thanos snap after a short delay
      setTimeout(() => {
        thanosSnapOtherSections(currentSprintContainer);
      }, CONFIG.FLASH_DELAY + 500);
      
      log('Successfully jumped to current sprint');
    } else {
      const sprintText = `Web Sprint ${getMondayString()}`;
      log('Sprint not found:', sprintText);
      alert(`No element found for "${sprintText}"`);
    }
  };

  const createButton = () => {
    const button = document.createElement('button');
    Object.assign(button, {
      id: CONFIG.BUTTON_ID,
      className: CONFIG.BUTTON_CLASS,
      innerHTML: '🫰 Snap to Current Sprint',
      style: 'font-size: 14px !important;',
      title: 'Jump to current sprint and snap away others'
    });
    
    button.addEventListener('click', scrollToCurrentWeekWebSprint);
    return button;
  };

  const createRestoreButton = () => {
    const button = document.createElement('button');
    Object.assign(button, {
      id: CONFIG.RESTORE_BUTTON_ID,
      className: `${CONFIG.BUTTON_CLASS} ${CONFIG.RESTORE_BUTTON_CLASS}`,
      innerHTML: '♻️ Restore All Sprints',
      style: 'font-size: 14px !important; bottom: 80px !important; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;',
      title: 'Restore all snapped sprint sections'
    });
    
    button.addEventListener('click', restoreSnappedSections);
    return button;
  };

  const showRestoreButton = () => {
    if (!document.getElementById(CONFIG.RESTORE_BUTTON_ID)) {
      const restoreButton = createRestoreButton();
      if (document.body) {
        document.body.appendChild(restoreButton);
        log('Restore button added');
      }
    }
  };

  const hideRestoreButton = () => {
    const existing = document.getElementById(CONFIG.RESTORE_BUTTON_ID);
    if (existing) {
      existing.remove();
      log('Restore button removed');
    }
  };

  const insertButton = () => {
    log('Attempting to insert button...');
    
    const existing = document.getElementById(CONFIG.BUTTON_ID);
    if (existing) {
      existing.remove();
      log('Removed existing button');
    }
    
    if (document.body) {
      document.body.appendChild(button);
      log('Button appended to body');
    }
    
    const check = document.getElementById(CONFIG.BUTTON_ID);
    log('Button successfully added to DOM:', !!check);
  };

  const init = () => {
    log('Sprint Jumper script loaded');
    log('Creating sprint jump button...');
    
    // Try multiple insertion methods for reliability
    CONFIG.INSERTION_DELAYS.forEach(delay => 
      setTimeout(insertButton, delay)
    );
    
    document.addEventListener('DOMContentLoaded', insertButton);
    window.addEventListener('load', insertButton);
    
    log('Sprint Jumper script setup complete');
  };

  const button = createButton();
  init();
})();