// Arc Boost Script: Adds a blue "Jump to current sprint" button at bottom right
(() => {
  'use strict';
  
  const CONFIG = {
    BUTTON_ID: 'arc-boost-sprint-jump-button',
    BUTTON_CLASS: 'arc-boost-sprint-btn',
    FLASH_CLASS: 'arc-boost-sprint-flash-effect',
    FLASH_DURATION: 1200,
    FLASH_DELAY: 450,
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

  const findSprintElement = (sprintText) => {
    return Array.from(document.querySelectorAll('h2'))
      .find(h2 => h2.textContent.trim() === sprintText);
  };

  const getTargetElement = (h2) => {
    const container = h2.closest('div[data-drop-target-for-element="true"]');
    return container?.parentElement || container || h2;
  };

  const scrollToCurrentWeekWebSprint = () => {
    const sprintText = `Web Sprint ${getMondayString()}`;
    log('Looking for:', sprintText);
    
    const h2 = findSprintElement(sprintText);
    if (h2) {
      const targetElement = getTargetElement(h2);
      scrollAndFlash(targetElement);
      log('Successfully jumped to sprint:', sprintText);
    } else {
      log('Sprint not found:', sprintText);
      alert(`No element found for "${sprintText}"`);
    }
  };

  const createButton = () => {
    const button = document.createElement('button');
    Object.assign(button, {
      id: CONFIG.BUTTON_ID,
      className: CONFIG.BUTTON_CLASS,
      innerHTML: 'Jump to Current Sprint →',
      title: 'Jump to current sprint'
    });
    
    button.addEventListener('click', scrollToCurrentWeekWebSprint);
    return button;
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