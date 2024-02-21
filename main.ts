import {Editor, EditorPosition, MarkdownView, Platform, Plugin, normalizePath} from 'obsidian';

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
    if (!Platform.isMobile) {
      return;
    }

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

    this.addCommand({
      id: 'mobile-suggester-helper-select-heading',
      name: 'Select the highlighted item in the suggester.',
      icon: 'check-in-circle',
      callback: () => {
        const editor = this.getEditor();
        if (!editor) {
          return;
        }

        const position = editor.getCursor();
        if (!position) {
          return;
        }

        const line = editor.getLine(position.line);
        let linkStart = line.indexOf('[[');
        if (linkStart === -1) {
          return;
        }

        linkStart += 2;

        const stringPath = this.getPathForSelectedSuggesterItem();
        if (!stringPath) {
          return;
        }

        editor.replaceRange(stringPath, {
          line: position.line,
          ch: linkStart,
        }, position);

        editor.setCursor({
          ch: linkStart + stringPath.length,
          line: position.line,
        });
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

  getPathForSelectedSuggesterItem(): string | null {
    const selectedNoteTitle = document.querySelector('body > div.suggestion-container > div.suggestion > div.suggestion-item.mod-complex.is-selected > div.suggestion-content > div.suggestion-title');
    if (!selectedNoteTitle) {
      return null;
    }

    const selectedNotePath = document.querySelector('body > div.suggestion-container > div.suggestion > div.suggestion-item.mod-complex.is-selected > div.suggestion-content > div.suggestion-note');

    let pathToFind = selectedNoteTitle.textContent;
    if (selectedNotePath) {
      const notePath = selectedNotePath.textContent;
      if (notePath?.endsWith('/')) {
        pathToFind = normalizePath(notePath+pathToFind);
      } else {
        pathToFind = notePath;
      }
    }

    return pathToFind;
  }

  /**
   * Gets the current markdown editor if it exists {@link https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/main.ts#L37-L41|Obsidian Smarter Paste Source}
   * @return {Editor} Returns the current codemirror editor if there is an active view of type markdown or null if there is not one.
   */
  private getEditor(): Editor | null {
    const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeLeaf) return null;
    return activeLeaf.editor;
  }
}
