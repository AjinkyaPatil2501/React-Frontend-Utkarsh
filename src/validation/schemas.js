

import {
  required,
  minLength,
  maxLength,
  numberOnly,
  email,
  pattern,
  dateNotFuture,
  ageValidator,
  validateField,
  validateCustomer
} from "./validator";

// ✅ FACTORY FUNCTIONS - These return schemas with proper translations
export const customerMasterSchema = (t) => ({
  name: {
    first: required(t("errors.required", { field: t("firstName") })),
    middle: required(t("errors.required", { field: t("middleName") })),
    last: required(t("errors.required", { field: t("lastName") }))
  },
  fatherHusbandName: required(t("errors.required", { field: t("fatherHusbandName") })),
  dob: (value) => {
    let error = required(t("errors.required", { field: t("dob") }))(value);
    if (error) return error;
    error = dateNotFuture(t("errors.futureDOB"))(value);
    if (error) return error;
    return ageValidator(0, t("errors.invalidDOB"))(value);
  },
  phone: (value) => {
    if (!value) return ""; // Optional
    let error = numberOnly(t("errors.numberOnly", { field: t("phone") }))(value);
    if (error) return error;
    error = minLength(10, t("errors.phoneDigits"))(value);
    if (error) return error;
    return maxLength(10, t("errors.phoneDigits"))(value);
  },
  email: (value) => {
    if (!value) return ""; // Optional
    return email(t("errors.invalidEmail"))(value);
  },
  pan: (value) => {
    let error = required(t("errors.required", { field: t("panNo") }))(value);
    if (error) return error;
    return pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, t("errors.invalidPAN"))(value);
  },
  aadhaar: (value) => {
    let error = required(t("errors.required", { field: t("aadhaar") }))(value);
    if (error) return error;
    error = numberOnly(t("errors.numberOnly", { field: t("aadhaar") }))(value);
    if (error) return error;
    error = minLength(12, t("errors.aadhaarDigits"))(value);
    if (error) return error;
    return maxLength(12, t("errors.aadhaarDigits"))(value);
  }
});

export const addressSchema = (t) => ({
  local: {
    address: (value) => validateField(value, [required(t("errors.required", { field: t("address") }))]),
    mobile1: (value) => validateField(value, [
      required(t("errors.required", { field: t("mobileNo1") })),
      numberOnly(t("errors.numberOnly", { field: t("mobileNo1") })),
      minLength(10, t("errors.phoneDigits")),
      maxLength(10, t("errors.phoneDigits"))
    ]),
    // city: (value) => validateField(value, [required(t("errors.required", { field: t("cityVillage") }))]),
    // state: (value) => validateField(value, [required(t("errors.required", { field: t("state") }))]),
    pincode: (value) => {
      if (!value) return ""; // Optional
      return validateField(value, [
        numberOnly(t("errors.numberOnly", { field: t("pincode") })),
        minLength(6, t("errors.pincodeDigits")),
        maxLength(6, t("errors.pincodeDigits"))
      ]);
    }
  },
  permanent: {
    address: (value) => validateField(value, [required(t("errors.required", { field: t("address") }))]),
    mobile1: (value) => validateField(value, [
      required(t("errors.required", { field: t("mobileNo1") })),
      numberOnly(t("errors.numberOnly", { field: t("mobileNo1") })),
      minLength(10, t("errors.phoneDigits")),
      maxLength(10, t("errors.phoneDigits"))
    ]),
    // city: (value) => validateField(value, [required(t("errors.required", { field: t("cityVillage") }))]),
    // state: (value) => validateField(value, [required(t("errors.required", { field: t("state") }))]),
    pincode: (value) => {
      if (!value) return ""; // Optional
      return validateField(value, [
        numberOnly(t("errors.numberOnly", { field: t("pincode") })),
        minLength(6, t("errors.pincodeDigits")),
        maxLength(6, t("errors.pincodeDigits"))
      ]);
    }
  }
});

export const companySchema = (t) => ({
  companyname: (value) => validateField(value, [required(t("errors.required", { field: t("companyFirmName") }))]),
  dateOfEstablishment: (value) => validateField(value, [required(t("errors.required", { field: t("dateOfEstablishment") }))])
});

export const companyAddressSchema = (t) => ({
  state: (value) => validateField(value, [required(t("errors.required", { field: t("state") }))]),
  city: (value) => validateField(value, [required(t("errors.required", { field: t("cityVillage") }))])
});

export const partnerSchema = {
  customerId: [],
  name: [],
  pan: [],
  mobile: [numberOnly(), minLength(10), maxLength(10)]
};

export const businessSchema = {
  occupation: [required()],
  email: [email()],
};

export const kycSchema = {
  name: [],
  number: [],
};

export const assetSchema = {
  name: [],
  amount: [numberOnly()]
};

export const assetsSummarySchema = {
  annualIncome: [numberOnly()],
  netWorth: [numberOnly()],
  usableAcre: [numberOnly()],
  usableGuntha: [numberOnly()],
  totalAcre: [numberOnly()],
  totalGuntha: [numberOnly()],
  eAgreementDate: []
};

export const userRegisterSchema = (t) => ({
  bankName: [required(t("invalidBankName"))],
  branchName: [required(t("invalidBranchName"))],
  shortName: [
    required(t("invalidShortName")),
    minLength(2, t("invalidShortNameLength")),
    maxLength(2, t("invalidShortNameLength")),
  ],
  designation: [required(t("invalidDesignation"))],
  userName: [required(t("invalidUserName"))],
  mobile: [
    required(t("invalidMobile")),
    numberOnly(t("invalidMobileDigits")),
    minLength(10, t("invalidMobileDigits")),
    maxLength(10, t("invalidMobileDigits")),
  ],
  debitLimit: [numberOnly(t("invalidDebitLimit"))],
  password: [
    required(t("invalidPassword")),
    minLength(6, t("invalidPasswordLength")),
  ],
  fromDate: [required(t("invalidFromDate"))],
  toDate: [required(t("invalidToDate"))],
  fromTime: [required(t("invalidFromTime"))],
  toTime: [required(t("invalidToTime"))],
});


// export const generalTabSchema = {
//   ledgerNo: [required()],
//   customerNumber: [required()]
// };

export const generalTabSchema = (t) => ({
  ledgerNo: [required(t("errors.required", { field: t("khatavniKramank") }))],
  customerNumber: [required(t("errors.required", { field: t("grahakKramank") }))]
});


// Add these new schemas to your schemas.js file

// export const financialInfoTabSchema = (t) => ({
//   termPeriod: (value, data) => {
//     // Check if either termMonths or termDays has a value
//     if (!data.termMonths && !data.termDays) {
//       return t("errors.required", { field: t("kalavadhi") });
//     }
//     return "";
//   },
//   depositAmount: [required(t("errors.required", { field: t("thevnichiRakkam") }))]
// });

// ✅ CORRECT - Use a workaround
export const financialInfoTabSchema = (t) => ({
  depositAmount: [required(t("errors.required", { field: t("thevnichiRakkam") }))]
});

// Add separate validation for period
export const validateFinancialTab = (data, t) => {
  const errors = {};
  
  // Validate period - at least one must be filled
  if (!data.termMonths && !data.termDays) {
    errors.termPeriod = t("errors.required", { field: t("kalavadhi") });
  }
  
  // Validate deposit amount
  const schema = financialInfoTabSchema(t);
  const amountErrors = validateCustomer(data, schema);
  
  return { ...errors, ...amountErrors };
};

export const savingsCurrentTabSchema = (t) => ({
  savingsAmount: [required(t("errors.required", { field: t("thevnichiRakkam") }))]
});