// ✅ Run a list of rules on a single field
// export const validateField = (value, rules = []) => {
//   for (let rule of rules) {
//     const error = rule(value);
//     if (error) return error;
//   }
//   return "";
// };
// ✅ Common reusable rules
export const required = (msg = "This field is required") => (value) =>
  !value ? msg : "";

export const minLength = (len, msg) => (value) =>
  value && value.length < len ? msg || `Minimum ${len} characters required` : "";

export const maxLength = (len, msg) => (value) =>
  value && value.length > len ? msg || `Maximum ${len} characters allowed` : "";

export const numberOnly = (msg = "Only numbers allowed") => (value) =>
  value && !/^\d+$/.test(value) ? msg : "";

export const email = (msg = "Invalid email format") => (value) =>
  value && !/^\S+@\S+\.\S+$/.test(value) ? msg : "";

export const pattern = (regex, msg) => (value) =>
  value && !regex.test(value) ? msg : "";

export const dateNotFuture = (msg = "Date cannot be in the future") => (value) => {
  if (!value) return "";
  return new Date(value) > new Date() ? msg : "";
};

export const dateAfter = (fromField, msg) => (value, data) => {
  if (!value || !data[fromField]) return "";
  return new Date(value) < new Date(data[fromField]) ? msg : "";
};


export const ageValidator = (minAge, msg) => (dob) => {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age < minAge ? msg : "";
};

export const allowTextOnly = (e, isMarathi = false) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
  if (allowedKeys.includes(e.key)) return;

  // Block numbers always
  if (/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }

  if (isMarathi) {
    // If using Shivaji01 font, allow Latin letters (they render as Marathi glyphs)
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  } else {
    // English mode: allow Latin letters + space
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  }
};

export const allowNumberOnly = (e) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  if (allowedKeys.includes(e.key)) return;

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};
//  Validation for user
export const validateUser = (data, schema) => {
  const errors = {};

  for (let key in schema) {
    if (typeof schema[key] === "object" && !Array.isArray(schema[key])) {
      errors[key] = validateUser(data[key] || {}, schema[key]);
    } else {
      const rules = schema[key];
      const error = validateField(data[key], rules);
      if (error) errors[key] = error;
    }
  }

  return errors;
};

// //validation for customer
// export const validateCustomer = (data, schema) => {
//   const errors = {};

//   const walk = (dataNode, schemaNode, errorNode) => {
//     Object.keys(schemaNode).forEach((key) => {
//       const validator = schemaNode[key];

//       // Nested objects
//       if (validator && typeof validator === "object" && !("length" in validator) && typeof validator !== "function") {
//         errorNode[key] = {};
//         walk(dataNode?.[key] || {}, validator, errorNode[key]);
//         if (Object.keys(errorNode[key]).length === 0) delete errorNode[key];
//       } 
//       // Single validator function
//       else if (typeof validator === "function") {
//         const error = validator(dataNode?.[key]);
//         if (error) errorNode[key] = error;
//       }
//     });
//   };

//   walk(data, schema, errors);
//   return errors;
// };

// Add this at the end of your validator.js file

// ✅ Helper to validate array of rules
export const validateField = (value, rules = []) => {
  for (let rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return "";
};

// ✅ Validation for customer
export const validateCustomer = (data, schema) => {
  const errors = {};

  const walk = (dataNode, schemaNode, errorNode) => {
    Object.keys(schemaNode).forEach((key) => {
      const validator = schemaNode[key];

      // Nested objects
      if (validator && typeof validator === "object" && !("length" in validator) && typeof validator !== "function") {
        errorNode[key] = {};
        walk(dataNode?.[key] || {}, validator, errorNode[key]);
        if (Object.keys(errorNode[key]).length === 0) delete errorNode[key];
      } 
      // Array of validators
      else if (Array.isArray(validator)) {
        const error = validateField(dataNode?.[key], validator);
        if (error) errorNode[key] = error;
      }
      // Single validator function
      else if (typeof validator === "function") {
        const error = validator(dataNode?.[key]);
        if (error) errorNode[key] = error;
      }
    });
  };

  walk(data, schema, errors);
  return errors;
};