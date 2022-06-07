class SafeStringify {
  static visit(obj, seen) {
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }

    if (seen.indexOf(obj) !== -1) {
      return '[Circular]';
    }
    seen.push(obj);

    if (typeof obj.toJSON === 'function') {
      try {
        const result = this.visit(obj.toJSON(), seen);
        seen.pop();

        return result;
      } catch (err) {
        return '[Error]';
      }
    }
    if (Array.isArray(obj)) {
      const result = obj.map(val => this.visit(val, seen));
      seen.pop();

      return result;
    }

    const result = Object.keys(obj).reduce((result, prop) => {
      result[prop] = this.visit(obj[prop], seen);
      
      return result;
    }, {});
    seen.pop();
    
    return result;
  }

  static safeJSON(obj) {
    const seen = []; 
    
    return this.visit(obj, seen);
  }

  static stringify(obj) {
    return JSON.stringify(this.safeJSON(obj));
  }
}

module.exports = SafeStringify;