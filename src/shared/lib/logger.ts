export const logger = {
  info: (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    if (data) {
      console.log(`[${timestamp}] ℹ️ ${message}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`[${timestamp}] ℹ️ ${message}`);
    }
  },

  action: (component: string, action: string, details?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 👆 [ACTION] ${component}: ${action}`, details ? JSON.stringify(details) : '');
  },

  error: (message: string, error?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ❌ ${message}`, error);
  }
};
