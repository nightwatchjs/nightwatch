const BaseCommand = require('./_base');
const { WEB_ELEMENT } = require('../../../../lib/transport/selenium-webdriver/method-mappings');

class IsVisibleCommand extends BaseCommand {
    async execute() {
        const { sessionId, id } = this.context;
        try {
            const isVisible = await this.transport.executeMethod(sessionId, WEB_ELEMENT.isVisible, { id });
            return isVisible;
        } catch (error) {
            console.error("Error checking element visibility:", error);
            return false; 
        }
    }
}

module.exports = IsVisibleCommand;
