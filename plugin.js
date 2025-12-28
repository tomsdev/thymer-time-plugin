class Plugin extends AppPlugin {
	
	onLoad() {
		this.ui.addCommandPaletteCommand({
			label: "Time",
			icon: "ti-clock",
			onSelected: async () => {
              const currentTime = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
              const content = [
                // Hint: you can customize the content inserted here
                { type: "text", text: currentTime },
              ];
              await this.addSegmentsAtCurrentPosition(content);
			}
		});
	}

   /**
   * Helper to add content at the current caret cursor position.
   * Note: This helper should probably be provided as a native plugin API.
   * Known bug: the caret cursor position is not updated.
   *
   * @param {PluginLineItemSegment[]} lineItemSegments
   *
   * Example values you can provide:
   * [{ type: "text", text: "hello world" }]
   * [{ type: "bold", text: "hello world" }]
   * [{ type: "italic", text: "hello world" }]
   * [{ type: "text", text: "with a tag " }, { type: "hashtag", text: "#demo" }]
   * [{ type: "datetime", text: {d: '20251224'} }]
   * [{ type: "ref", text: someRecord.guid }]
   * 
   */
    async addSegmentsAtCurrentPosition(lineItemSegments) {
      const activePanel = this.ui.getActivePanel();
		if (!activePanel) {
			this.ui.addToaster({
				title: "No active panel",
				message: "Please open a journal page first",
				dismissible: true,
				autoDestroyTime: 3000
			});
			return;
		}

		const journalRecord = activePanel.getActiveRecord();
		if (!journalRecord) {
			this.ui.addToaster({
				title: "No journal page",
				message: "Please open a journal page first",
				dismissible: true,
				autoDestroyTime: 3000
			});
			return;
		}

        const currentLineGuid = activePanel.getNavigation().state.positions[1];
		const existingLineItems = await journalRecord.getLineItems();
        const currentLineItem = existingLineItems.find(item => item.guid === currentLineGuid);
        currentLineItem.setSegments(currentLineItem.segments.concat(lineItemSegments));
    }
}
