import {Plugin} from 'obsidian';

const downArrowKeyEvent = new KeyboardEvent('keydown', {
  which: 40,
  keyCode: 40,
});

const upArrowKeyEvent = new KeyboardEvent('keydown', {
  which: 38,
  keyCode: 38,
});

export default class MobileSuggesterHelper extends Plugin {
  async onload() {
    this.addCommand({
      id: 'mobile-suggester-helper-move-selector-down',
      name: 'Move the selected item down one in the suggester.',
      icon: 'down-arrow-with-tail',
      callback: () => {
        this.dispatchEventIfSuggesterExists(downArrowKeyEvent);
      },
    });

    this.addCommand({
      id: 'mobile-suggester-helper-move-selector-up',
      name: 'Move the selected item up one in the suggester.',
      icon: 'up-arrow-with-tail',
      callback: () => {
        this.dispatchEventIfSuggesterExists(upArrowKeyEvent);
      },
    });
  }

  onunload() {}

  dispatchEventIfSuggesterExists(event: KeyboardEvent) {
    const suggesterDiv = document.querySelector('body > div.suggestion-container > div.suggestion');
    if (suggesterDiv) {
      suggesterDiv.dispatchEvent(event);
    }
  }
}
