import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerBasicInfo from "./CustomerBasicInfo";
import CustomerMasterSection from "./CustomerMasterSection";
import AddressSection from "./AddressSection";
import BusinessSection from "./BusinessSection";
import KYCSection from "./KYCSection";
import AssetsSection from "./AssetsSection";
import CompanyDetailsSection from "./CompanyDetailsSection";
import PartnerSection from "./PartnerSection";
import CompanyAddressSection from "./CompanyAddressSection";
import CompanyKycSection from "./CompanyKycSection";
import "../../ComponentCss/onboarding.css";
import { useTranslation } from "react-i18next";
import CustomerSearch from "./CustomerSearch";
import CompanySearch from "./CompanySearch";
import "../../ComponentCss/CustomerMasterSection.css";
import { customerMasterSchema, addressSchema, companySchema, companyAddressSchema } from "../../validation/schemas";
import { validateCustomer } from "../../validation/validator";

const initialFormData = {
  customerType: "Individual",
  customerMaster: { customerId: "", name: { first: "", middle: "", last: "" } },
  address: { local: {}, permanent: {} },
  business: {},
  kyc: [],
  assets: {
    list: [],
    annualIncome: "",
    netWorth: "",
    usableAcre: "",
    usableGuntha: "",
    totalAcre: "",
    totalGuntha: "",
    eAgreementDate: ""
  },
  company: {
    panNo: "",
    exciseNo: "",
    faxNo: "",
    tanNo: "",
    salesNo: ""
  },
  partners: []
};

const CustomerOnboardingForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formEnabled, setFormEnabled] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const showSubmitBar = formEnabled && !selectedCustomerId;
  const [searchMode, setSearchMode] = useState("customer");
  const { user } = useSelector((u) => u.auth);
  const firstFieldRef = useRef(null);
 const [personalDetails, setPersonalDetails] = useState({
  educationList: [],
  castList: [],
  religionList: [],
  countryList: [],
  stateList: [],
  districtList: [],
  cityList: [],
  talukaList: [],
  wardList: [],
  occupationList: []
});

  const [errors, setErrors] = useState({
    customerMaster: {},
    address: { local: {}, permanent: {} },
    company: {},
    companyAddress: {} // ✅ FIXED: Initialize with nested structure
  });

  // ✅ FIXED: Added touched state to track user interaction
  const [touched, setTouched] = useState({
    customerMaster: {},
    address: { local: {}, permanent: {} },
    company: {},
    companyAddress: {}
  });

 useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          "https://utkarsh-core-banking.onrender.com/customers/v1/personaldetails",
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        setPersonalDetails(data);
      } catch (error) {
        console.error(error);
        alert("Can't fetch the Personal Details.");
      }
    };

    fetchAddress();
  }, []);

  const updateSection = (section, updatedData) => {
    setFormData(prev => ({ ...prev, [section]: updatedData }));

    // ✅ FIXED: Validate based on customer type and section
    if (formData.customerType === "Individual") {
      if (section === "customerMaster") {
        const schema = customerMasterSchema(t);
        const newErrors = validateCustomer(updatedData, schema);
        setErrors(prev => ({
          ...prev,
          customerMaster: newErrors
        }));
      }

      if (section === "address") {
        const schema = addressSchema(t);
        const newErrors = validateCustomer(updatedData, schema);
        setErrors(prev => ({
          ...prev,
          address: newErrors
        }));
      }
    }

    if (formData.customerType === "Company") {
      if (section === "company") {
        const schema = companySchema(t);

        // ✅ CRITICAL FIX: Map form data to schema field names
        const dataForValidation = {
          companyname: updatedData.name,
          dateOfEstablishment: updatedData.estDate
        };

        const newErrors = validateCustomer(dataForValidation, schema);
        setErrors(prev => ({
          ...prev,
          company: newErrors
        }));
      }

      if (section === "address") {
        const schema = companyAddressSchema(t);

        // ✅ For company, validate only permanent address
        const dataForValidation = {
          state: updatedData.permanent?.state,
          city: updatedData.permanent?.city
        };

        const newErrors = validateCustomer(dataForValidation, schema);
        setErrors(prev => ({
          ...prev,
          companyAddress: newErrors
        }));
      }
    }
  };
  const updateCustomerType = (value) => {
    setFormData(prev => ({ ...prev, customerType: value }));
  };

  const updateCustomerId = (value) => {
    setFormData(prev => ({
      ...prev,
      customerMaster: { ...prev.customerMaster, customerId: value }
    }));
  };

  useEffect(()=>{
    if(!formEnabled) return;
 
    if(formData.customerType==="Individual")
    firstFieldRef.current?.focus();
  

   
  },[]);

  const hasErrors = (errors) => {
    return Object.values(errors).some(val => {
      if (!val) return false;
      if (typeof val === "string") return val.trim() !== "";
      if (typeof val === "object") return hasErrors(val);
      return false;
    });
  };

  const isFormValid = () => {
    if (formData.customerType === "Individual") {
      const customerErrors = validateCustomer(
        formData.customerMaster,
        customerMasterSchema(t)
      );

      const addressErrors = validateCustomer(
        formData.address,
        addressSchema(t)
      );

      return !hasErrors(customerErrors) && !hasErrors(addressErrors);
    }

    if (formData.customerType === "Company") {
      const companyErrors = validateCustomer(
        formData.company,
        companySchema(t)
      )
      const companyAddressErrors = validateCustomer(
        formData.companyAddress,
        companyAddressSchema(t)
      )
      return !hasErrors(companyErrors) && !hasErrors(companyAddressErrors);
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formEnabled) return;

    // ✅ FIXED: Separate validation logic for Individual vs Company
    if (formData.customerType === "Individual") {
      // Validate Individual customer
      const customerErrors = validateCustomer(
        formData.customerMaster,
        customerMasterSchema(t)
      );

      const addressErrors = validateCustomer(
        formData.address,
        addressSchema(t)
      );

      console.log("Customer Errors:", customerErrors);
      console.log("Address Errors:", addressErrors);

      // Mark all fields as touched on submit
      setTouched({
        customerMaster: {
          name: { first: true, middle: true, last: true },
          fatherHusbandName: true,
          dob: true,
          pan: true,
          aadhaar: true
        },
        address: {
          local: { address: true, mobile1: true, city: true, state: true },
          permanent: { address: true, mobile1: true, city: true, state: true }
        }
      });

      if (hasErrors(customerErrors) || hasErrors(addressErrors)) {
        setErrors({
          customerMaster: customerErrors,
          address: addressErrors
        });
        alert("Please fix validation errors before submitting.");

        document.querySelector(".input-error")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        return; // ✅ Stop here if validation fails
      }

      // ✅ If validation passes, submit Individual customer
      try {
        const response = await fetch('https://utkarsh-core-banking.onrender.com/customers/v1/create/individual', {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            master: {
              customerType: "Individual",
              firstName: formData.customerMaster?.name?.first,
              middleName: formData.customerMaster?.name?.middle,
              lastName: formData.customerMaster?.name?.last,
              fatherOrHusbandName: formData.customerMaster?.fatherHusbandName,
              gender: formData.customerMaster?.gender,
              dateOfBirth: formData.customerMaster?.dob,
              isMinor: formData.customerMaster?.minor === "Yes" ? true : false,
              parentName: formData.customerMaster?.parentName,
              maritalStatus: formData.customerMaster?.maritalStatus,
              education: formData.customerMaster?.education,
              religion: formData.customerMaster?.religion,
              caste: formData.customerMaster?.caste,
              subCaste: formData.customerMaster?.subCaste,
              bloodGroup: formData.customerMaster?.bloodGroup,
              address: formData.address?.local?.address,
              phoneNo: formData.address?.local?.mobile1,
              emailId: formData.customerMaster?.email,
              emailId1: formData.customerMaster?.email1,
              emailId2: formData.customerMaster?.email2,
              panCardNo: formData.customerMaster?.pan,
              aadhaarCardNo: formData.customerMaster?.aadhaar,
              gstNo: formData.customerMaster?.gst,
              introducerId: formData.customerMaster?.introducerId,
              photoBase64: formData.customerMaster?.photo,
              signatureBase64: formData.customerMaster?.signature
            },
            address: {
              localCountry: formData.address?.local?.country,
              localState: formData.address?.local?.state,
              localDistrict: formData.address?.local?.district,
              localTaluka: formData.address?.local?.taluka,
              localCityOrVillage: formData.address?.local?.city,
              localAddress: formData.address?.local?.address,
              localWardNo: formData.address?.local?.wardNo,
              localPincode: formData.address?.local?.pincode,
              localPhone1: formData.address?.local?.phone1,
              localPhone2: formData.address?.local?.phone2,
              localMobile1: formData.address?.local?.mobile1,
              localMobile2: formData.address?.local?.mobile2,
              permanentCountry: formData.address?.permanent?.country,
              permanentState: formData.address?.permanent?.state,
              permanentDistrict: formData.address?.permanent?.district,
              permanentTaluka: formData.address?.permanent?.taluka,
              permanentCityOrVillage: formData.address?.permanent?.city,
              permanentAddress: formData.address?.permanent?.address,
              permanentWardNo: formData.address?.permanent?.wardNo,
              permanentPincode: formData.address?.permanent?.pincode,
              permanentPhone1: formData.address?.permanent?.phone1,
              permanentPhone2: formData.address?.permanent?.phone2,
              permanentMobile1: formData.address?.permanent?.mobile1,
              permanentMobile2: formData.address?.permanent?.mobile2
            },
            occupation: {
              occupationId: formData.business?.occupation,
              occupationName: formData.business?.occupationType,
              occupationAddress: formData.business?.address,
              occupationEmail: formData.business?.email,
              occupationPhone1: formData.business?.phone1,
              occupationPhone2: formData.business?.phone2
            },
            kyc: formData.kyc.map(k => ({
              docName: k.name,
              docNumber: k.number,
              docPhoto: k.image
            })),
            assets: formData.assets?.list
              ? formData.assets.list.map(item => ({
                assetName: item.name,
                assetValue: item.amount,
                assetPhoto: formData.assets.assetPhoto || null,
                annualIncome: formData.assets.annualIncome,
                netWorth: formData.assets.netWorth,
                usableLandAcre: formData.assets.usableAcre,
                usableLandGuntha: formData.assets.usableGuntha,
                totalLandAcre: formData.assets.totalAcre,
                totalLandGuntha: formData.assets.totalGuntha,
                eAgreementEndDate: formData.assets.eAgreementDate
              })) : []
          })
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("Backend error:", result);
          alert("Individual customer creation failed");
          return;
        }

        console.log("Individual customer created:", result);
        alert("Individual customer created successfully ✅");
        setFormEnabled(false);
        setFormData(initialFormData);
        setSelectedCustomerId(null);
      } catch (error) {
        console.error("Individual submit error:", error);
        alert("Unable to create individual customer");
      }
    }
    else if (formData.customerType === "Company") {
      // ✅ Validate Company customer - FIXED: use correct field names
      const companySchemaObj = companySchema(t);
      const companyAddressSchemaObj = companyAddressSchema(t);

      // ✅ CRITICAL FIX: Map form data to schema field names
      const companyDataForValidation = {
        companyname: formData.company.name,  // schema expects 'companyname'
        dateOfEstablishment: formData.company.estDate  // schema expects 'dateOfEstablishment'
      };

      const addressDataForValidation = {
        state: formData.address?.permanent?.state,
        city: formData.address?.permanent?.city
      };

      const companyErrors = validateCustomer(companyDataForValidation, companySchemaObj);
      const companyAddressErrors = validateCustomer(addressDataForValidation, companyAddressSchemaObj);

      console.log("Company Errors:", companyErrors);
      console.log("Company Address Errors:", companyAddressErrors);

      // Mark company fields as touched
      setTouched({
        company: {
          companyname: true,
          dateOfEstablishment: true
        },
        companyAddress: {
          state: true,
          city: true
        }
      });

      if (hasErrors(companyErrors) || hasErrors(companyAddressErrors)) {
        setErrors({
          company: companyErrors,
          companyAddress: companyAddressErrors
        });
        alert("Please fix validation errors before submitting.");

        document.querySelector(".input-error")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        return; // ✅ Stop here if validation fails
      }

      // ✅ If validation passes, submit Company
      try {
        const response = await fetch(
          "https://utkarsh-core-banking.onrender.com/customers/v1/create/company",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyDetails: {
                companyname: formData.company.name,
                constitutionType: formData.company.constitution,
                natureOfBusiness: formData.company.nature,
                dateOfEstablishment: formData.company.estDate,
                country: formData.address?.permanent?.country,
                state: formData.address?.permanent?.state,
                district: formData.address?.permanent?.district,
                taluka: formData.address?.permanent?.taluka,
                cityOrVillage: formData.address?.permanent?.city,
                address: formData.address?.permanent?.address,
                wardNo: formData.address?.permanent?.wardNo,
                pincode: formData.address?.permanent?.pincode,
                phoneNo1: formData.address?.permanent?.phone1,
                phoneNo2: formData.address?.permanent?.phone2,
                email: formData.address?.permanent?.email,
                website: formData.address?.permanent?.website,
                faxNo: formData.company.faxNo,
                panCardNo: formData.company.panNo,
                exciseNo: formData.company.exciseNo,
                tanNo: formData.company.tanNo,
                salesNo: formData.company.salesNo,
              },
              companyContact: formData.kyc.map(k => ({
                kycDocName: k.name,
                kycDocNumber: k.number,
                kycDocImage: k.kycDocImage,
              })),
              partners: formData.partners.map(p => ({
                partnerId: p.customerId,
                partnerName: p.name,
                panNo: p.pan,
                mobileNo: p.mobile
              }))
            })
          }
        );

        // ✅ FIXED: Handle 403 and empty response properly
        if (!response.ok) {
          let errorMessage = `Company creation failed (${response.status})`;

          try {
            const errorText = await response.text();
            if (errorText) {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorMessage;
            }
          } catch (e) {
            // If parsing fails, use status text
            errorMessage = `${errorMessage}: ${response.statusText}`;
          }

          alert(errorMessage);
          console.error("Company creation failed:", errorMessage);
          return;
        }

        // ✅ FIXED: Handle successful response (might be empty)
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            console.log("BACKEND RESPONSE", result);
          } else {
            console.log("Company created successfully (no JSON response)");
          }
        } catch (e) {
          console.log("Company created successfully (empty response)");
        }

        alert("Company created successfully ✅");
        setFormEnabled(false);
        setFormData(initialFormData);
      } catch (error) {
        console.error("Company submit error", error);
        alert("Unable to create company: " + error.message);
      }
    }
  };

  const handleNew = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(initialFormData);
    setFormEnabled(true);
    setSelectedCustomerId(null);  // ✅ ADD THIS LINE!
    setTimeout(() => {
    firstFieldRef.current?.focus();
  }, 0);
  };

  const handleCancel = () => {
    setFormEnabled(false);
    setFormData(initialFormData);
    setSelectedCustomerId(null);  // Already there
    // ✅ FIXED: Reset errors and touched state
    setErrors({
      customerMaster: {},
      address: { local: {}, permanent: {} }
    });
    setTouched({
      customerMaster: {},
      address: { local: {}, permanent: {} },
      company: {},
      companyAddress: {}
    });
  };

  const handleExit = () => {
    setFormEnabled(false);
    navigate("/navbar");
  };

  const handleUpdate = async () => {
    // ✅ FIXED: Validate before update based on customer type
    if (formData.customerType === "Individual") {
      const customerErrors = validateCustomer(
        formData.customerMaster,
        customerMasterSchema(t)
      );

      const addressErrors = validateCustomer(
        formData.address,
        addressSchema(t)
      );

      if (hasErrors(customerErrors) || hasErrors(addressErrors)) {
        setErrors({
          customerMaster: customerErrors,
          address: addressErrors
        });

        setTouched({
          customerMaster: {
            name: { first: true, middle: true, last: true },
            fatherHusbandName: true,
            dob: true,
            pan: true,
            aadhaar: true,
            email: true,
            phone: true
          },
          address: {
            local: {
              address: true,
              mobile1: true,
              city: true,
              state: true,
              pincode: true
            },
            permanent: {
              address: true,
              mobile1: true,
              city: true,
              state: true,
              pincode: true
            }
          }
        });

        alert("Please fix validation errors before updating");
        return;
      }
    }

    // ✅ FIXED: Company validation - use correct data mapping
    if (formData.customerType === "Company") {
      const companyErrors = validateCustomer(
        {
          companyname: formData.company.name,
          dateOfEstablishment: formData.company.estDate
        },
        companySchema(t)
      );

      const companyAddressErrors = validateCustomer(
        {
          state: formData.address?.permanent?.state,
          city: formData.address?.permanent?.city
        },
        companyAddressSchema(t)
      );

      if (hasErrors(companyErrors) || hasErrors(companyAddressErrors)) {
        setErrors({
          company: companyErrors,
          companyAddress: companyAddressErrors
        });

        setTouched({
          company: {
            companyname: true,
            dateOfEstablishment: true
          },
          companyAddress: {
            state: true,
            city: true
          }
        });

        alert("Please fix validation errors before updating");
        return;
      }
    }

    if (!selectedCustomerId) {
      alert("No customer selected for update");
      return;
    }

    try {
      let url = `https://utkarsh-core-banking.onrender.com/customers/v1/update/${selectedCustomerId}`;
      let payload = formData.customerType === "Company"
        ? {
          userId: user?.userId,
          officerId: user?.userId,
          type: formData.customerType,
          companyDetails: {
            companyname: formData.company.name,
            constitutionType: formData.company.constitution,
            natureOfBusiness: formData.company.nature,
            dateOfEstablishment: formData.company.estDate,
            country: formData.address?.permanent?.country,
            state: formData.address?.permanent?.state,
            district: formData.address?.permanent?.district,
            taluka: formData.address?.permanent?.taluka,
            cityOrVillage: formData.address?.permanent?.city,
            address: formData.address?.permanent?.address,
            wardNo: formData.address?.permanent?.wardNo,
            pincode: formData.address?.permanent?.pincode,
            phoneNo1: formData.address?.permanent?.phone1,
            phoneNo2: formData.address?.permanent?.phone2,
            email: formData.address?.permanent?.email,
            website: formData.address?.permanent?.website,
            faxNo: formData.company.faxNo,
            panCardNo: formData.company.panNo,
            exciseNo: formData.company.exciseNo,
            tanNo: formData.company.tanNo,
            salesNo: formData.company.salesNo,
          },
          companyContact: formData.kyc.map((k) => ({
            kycDocName: k.name,
            kycDocNumber: k.number,
            kycDocImage: k.kycDocImage,
          })),
          partners: formData.partners.map((p) => ({
            partnerId: p.customerId,
            partnerName: p.name,
            panNo: p.pan,
            mobileNo: p.mobile,
          })),
        }
        : {
          userId: user?.userId,
          officerId: user?.userId,
          type: formData.customerType,
          master: {
            firstName: formData.customerMaster?.name?.first,
            middleName: formData.customerMaster?.name?.middle,
            lastName: formData.customerMaster?.name?.last,
            fatherOrHusbandName: formData.customerMaster?.fatherHusbandName,
            gender: formData.customerMaster?.gender,
            dateOfBirth: formData.customerMaster?.dob,
            isMinor: formData.customerMaster?.minor === "Yes",
            parentName: formData.customerMaster?.parentName,
            maritalStatus: formData.customerMaster?.maritalStatus,
            education: formData.customerMaster?.education,
            religion: formData.customerMaster?.religion,
            caste: formData.customerMaster?.caste,
            subCaste: formData.customerMaster?.subCaste,
            bloodGroup: formData.customerMaster?.bloodGroup,
            address: formData.customerMaster?.address,
            phoneNo: formData.customerMaster?.mobile1,
            emailId: formData.customerMaster?.email,
            panCardNo: formData.customerMaster?.pan,
            aadhaarCardNo: formData.customerMaster?.aadhaar,
            gstNo: formData.customerMaster?.gst,
            introducerId: formData.customerMaster?.introducerId,
            photoBase64: formData.customerMaster?.photo,
            signatureBase64: formData.customerMaster?.signature,
          },
          address: {
            localCountry: formData.address?.local?.country,
            localState: formData.address?.local?.state,
            localDistrict: formData.address?.local?.district,
            localTaluka: formData.address?.local?.taluka,
            localCityOrVillage: formData.address?.local?.city,
            localAddress: formData.address?.local?.address,
            localWardNo: formData.address?.local?.wardNo,
            localPincode: formData.address?.local?.pincode,
            localPhone1: formData.address?.local?.phone1,
            localPhone2: formData.address?.local?.phone2,
            localMobile1: formData.address?.local?.mobile1,
            localMobile2: formData.address?.local?.mobile2,
            permanentCountry: formData.address?.permanent?.country,
            permanentState: formData.address?.permanent?.state,
            permanentDistrict: formData.address?.permanent?.district,
            permanentTaluka: formData.address?.permanent?.taluka,
            permanentCityOrVillage: formData.address?.permanent?.city,
            permanentAddress: formData.address?.permanent?.address,
            permanentWardNo: formData.address?.permanent?.wardNo,
            permanentPincode: formData.address?.permanent?.pincode,
            permanentPhone1: formData.address?.permanent?.phone1,
            permanentPhone2: formData.address?.permanent?.phone2,
            permanentMobile1: formData.address?.permanent?.mobile1,
            permanentMobile2: formData.address?.permanent?.permanentMobile2
          },
          occupation: {
            occupationId: formData.business?.occupation,
            occupationName: formData.business?.occupationType,
            occupationAddress: formData.business?.address,
            occupationEmail: formData.business?.email,
            occupationPhone1: formData.business?.phone1,
            occupationPhone2: formData.business?.phone2
          },
          kyc: formData.kyc.map((k) => ({
            docName: k.name,
            docNumber: k.number,
            docPhoto: k.image,
          })),
          assets: formData.assets?.list
            ? formData.assets.list.map(item => ({
              assetName: item.name,
              assetValue: item.amount,
              assetPhoto: formData.assets.assetPhoto || null,
              annualIncome: formData.assets.annualIncome,
              netWorth: formData.assets.netWorth,
              usableLandAcre: formData.assets.usableAcre,
              usableLandGuntha: formData.assets.usableGuntha,
              totalLandAcre: formData.assets.totalAcre,
              totalLandGuntha: formData.assets.totalGuntha,
              eAgreementEndDate: formData.assets.eAgreementDate
            })) : []
        };

      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Update failed:", text);
        alert("Update failed ❌");
        return;
      }

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 0) {
        const result = await response.json();
      }

      alert("Customer updated successfully ✅");
      setFormEnabled(false);
      setFormData(initialFormData);
      setSelectedCustomerId(null);  // Already there

      // ✅ FIXED: Reset errors and touched state after successful update
      setErrors({
        customerMaster: {},
        address: { local: {}, permanent: {} },
        company: {},
        companyAddress: {}
      });
      setTouched({
        customerMaster: {},
        address: { local: {}, permanent: {} },
        company: {},
        companyAddress: {}
      });

    } catch (err) {
      console.error("Update error:", err);
      alert("Unable to update customer");
    }
  };

  const handleCustomerSelect = async (c) => {
    try {
      const res = await fetch(
        `https://utkarsh-core-banking.onrender.com/customers/v1/fullCustomer/${c.customerId}`
      );

      if (!res.ok) throw new Error("Failed to load customer");

      const full = await res.json();
      // console.log(full);
      setFormData({
        customerType: full.customerType,
        customerMaster: {
          customerId: c.customerId,
          name: {
            first: full.master?.firstName || "",
            middle: full.master?.middleName || "",
            last: full.master?.lastName || ""
          },
          fatherHusbandName: full.master?.fatherOrHusbandName,
          gender: full.master?.gender,
          dob: full.master?.dateOfBirth,
          minor: full.master?.isMinor ? "Yes" : "No",
          parentName: full.master?.parentName,
          address: full.master?.address,
          mobile1: full.master?.phoneNo,
          maritalStatus: full.master?.maritalStatus,
          education: full.master?.education,
          religion: full.master?.religion,
          caste: full.master?.caste,
          subCaste: full.master?.subCaste,
          bloodGroup: full.master?.bloodGroup,
          email: full.master?.emailId,
          email1: full.master?.emailId1,
          email2: full.master?.emailId2,
          pan: full.master?.panCardNo,
          aadhaar: full.master?.aadhaarCardNo,
          gst: full.master?.gstNo,
          introducerId: full.master?.introducerId,
          photo: full.master?.photoBase64,
          signature: full.master?.signatureBase64
        },
        address: {
          local: {
            country: full.address?.localCountry || "",
            state: full.address?.localState || "",
            district: full.address?.localDistrict || "",
            taluka: full.address?.localTaluka || "",
            city: full.address?.localCityOrVillage || "",
            address: full.address?.localAddress || "",
            wardNo: full.address?.localWardNo || "",
            pincode: full.address?.localPincode || "",
            phone1: full.address?.localPhone1 || "",
            phone2: full.address?.localPhone2 || "",
            mobile1: full.address?.localMobile1 || "",
            mobile2: full.address?.localMobile2 || ""
          },
          permanent: {
            country: full.address?.permanentCountry || "",
            state: full.address?.permanentState || "",
            district: full.address?.permanentDistrict || "",
            taluka: full.address?.permanentTaluka || "",
            city: full.address?.permanentCityOrVillage || "",
            address: full.address?.permanentAddress || "",
            wardNo: full.address?.permanentWardNo || "",
            pincode: full.address?.permanentPincode || "",
            phone1: full.address?.permanentPhone1 || "",
            phone2: full.address?.permanentPhone2 || "",
            mobile1: full.address?.permanentMobile1 || "",
            mobile2: full.address?.permanentMobile2 || ""
          }
        },
        business: {
          occupation: full.occupation?.occupationId,
          address: full.occupation?.occupationAddress,
          occupationType: full.occupation?.occupationName,
          email: full.occupation?.occupationEmail,
          phone1: full.occupation?.occupationPhone1,
          phone2: full.occupation?.occupationPhone2,
        },
        kyc: full.kyc.map(k => ({
          name: k.docName,
          number: k.docNumber,
          image: k.docPhoto
        })) || [],
        assets: {
          list: full.assets.map(item => ({
            name: item.assetName,
            amount: item.assetValue,
          })) || [],
          annualIncome: full.assets?.[0]?.annualIncome,
          netWorth: full.assets?.[0]?.netWorth,
          usableAcre: full.assets?.[0]?.usableLandAcre,
          usableGuntha: full.assets?.[0]?.usableLandGuntha,
          totalAcre: full.assets?.[0]?.totalLandAcre,
          totalGuntha: full.assets?.[0]?.totalLandGuntha,
          eAgreementDate: full.assets?.[0]?.eAgreementEndDate,
        },
        company: full.company || {
          panNo: "",
          exciseNo: "",
          faxNo: "",
          tanNo: "",
          salesNo: ""
        },
        partners: full.partners || []
      });

      setSelectedCustomerId(c.customerId);
      setFormEnabled(true);
      setShowSearch(false);

    } catch (err) {
      console.error(err);
      alert("Unable to load full customer data");
    }
  };

  const handleCompanySelect = async (company) => {
    try {
      const res = await fetch(
        `https://utkarsh-core-banking.onrender.com/customers/v1/fullCompany/${company.customerId}`
      );

      if (!res.ok) throw new Error("Failed to load customer");

      const data = await res.json();

      // console.log("Company Name:", data.companyDetails.tanNo);

      setFormData((prev) => ({
        ...prev,
        customerType: "Company",
        customerMaster: { customerId: company.customerId },
        company: {
          ...prev.company,
          name: data.companyDetails.companyname || "",
          constitution: data.companyDetails.constitutionType || "",
          nature: data.companyDetails.natureOfBusiness || "",
          estDate: data.companyDetails.dateOfEstablishment || "",
          panNo: data.companyDetails?.panCardNo || "",
          exciseNo: data.companyDetails?.exciseNo || "",
          faxNo: data.companyDetails?.faxNo || "",
          tanNo: data.companyDetails?.tanNo || "",
          salesNo: data.companyDetails?.salesNo || ""
        },
        address: {
          ...prev.address,
          permanent: {
            country: data.companyDetails.country || "",
            state: data.companyDetails.state || "",
            district: data.companyDetails.district || "",
            taluka: data.companyDetails.taluka || "",
            city: data.companyDetails.cityOrVillage || "",
            address: data.companyDetails.address || "",
            wardNo: data.companyDetails.wardNo || "",
            pincode: data.companyDetails.pincode || "",
            phone1: data.companyDetails.phoneNo1 || "",
            phone2: data.companyDetails.phoneNo2 || "",
            email: data.companyDetails.email || "",
            website: data.companyDetails.website || ""
          }
        },
        kyc: data.companyContact?.map(k => ({
          name: k.kycDocName,
          number: k.kycDocNumber,
          kycDocImage: k.kycDocImage
        })) || [],
        partners: data.partners.map(p => ({
          customerId: p.partnerId,
          name: p.partnerName,
          pan: p.panNo,
          mobile: p.mobileNo
        })) || []
      }));

      setSelectedCustomerId(company.customerId);
      setFormEnabled(true);
      setShowSearch(false);

    } catch (err) {
      console.error(err);
      alert("Unable to load full customer data");
    }
  };

  return (
    <div className="onboarding-wrapper">
      {showSearch && (
        <div style={{ margin: 10 }}>
          <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 10 }}>
            <strong>{t("search")} : </strong>
            <label style={{ marginLeft: 10 }}>
              <input
                type="radio"
                name="searchMode"
                value="customer"
                checked={searchMode === "customer"}
                onChange={() => setSearchMode("customer")}
              />
               {t("individual")} 
            </label>

            <label style={{ marginLeft: 10 }}>
              <input
                type="radio"
                name="searchMode"
                value="company"
                checked={searchMode === "company"}
                onChange={() => setSearchMode("company")}
              />
               {t("company")} 
            </label>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => setShowSearch(false)}
            >
              {t("close")}
            </button>
          </div>

          {searchMode === "customer" && (
            <CustomerSearch
              onBack={() => setShowSearch(false)}
              onCustomerSelect={handleCustomerSelect}
            />
          )}

          {searchMode === "company" && (
            <CompanySearch
              onBack={() => setShowSearch(false)}
              onCompanySelect={handleCompanySelect}
            />
          )}
        </div>
      )}

      {!showSearch && (
        <form
          id="onboarding-form"
          className="onboarding-form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <fieldset
            key={formEnabled ? "enabled" : "disabled"}
            disabled={!formEnabled}
          >
            <CustomerBasicInfo
              customerType={formData.customerType}
              customerId={formData.customerMaster.customerId}
              onTypeChange={updateCustomerType}
              onIdChange={updateCustomerId}
            />

            {formData.customerType === "Individual" && (
              <>
                <CustomerMasterSection
                  data={formData.customerMaster}
                  onChange={(u) => updateSection("customerMaster", u)}
                  errors={errors.customerMaster}
                  touched={touched.customerMaster}
                  firstNameRef={firstFieldRef}
                  personalDetails={personalDetails}
                />

                <AddressSection
                  data={formData.address}
                  onChange={(u) => updateSection("address", u)}
                  errors={errors.address}
                  touched={touched.address}
                  personalDetails={personalDetails}
                />
                <BusinessSection
                  data={formData.business}
                  onChange={(u) => updateSection("business", u)}
                  personalDetails={personalDetails}
                />
                <KYCSection
                  data={formData.kyc}
                  onChange={(u) => updateSection("kyc", u)}
                  customerId={selectedCustomerId}
                />
                <AssetsSection
                  data={formData.assets}
                  onChange={(u) => updateSection("assets", u)}
                />
              </>
            )}

            {formData.customerType === "Company" && (
              <>
                <CompanyDetailsSection
                  data={formData.company}
                  onChange={(u) => updateSection("company", u)}
                  errors={errors.company}
                  touched={touched.company}
                />
                <CompanyAddressSection
                  data={formData.address}
                  onChange={(u) => updateSection("address", u)}
                  errors={errors.companyAddress}
                  touched={touched.companyAddress}
                  personalDetails={personalDetails}
                />
                <CompanyKycSection
                  data={formData.kyc}
                  companyData={formData.company}
                  onChange={(updated) => updateSection("kyc", updated)}
                  onCompanyChange={(companyData) =>
                    updateSection("company", {
                      ...formData.company,
                      ...companyData
                    })
                  }
                />
                <PartnerSection
                  data={formData.partners}
                  onChange={(u) => updateSection("partners", u)}
                />
              </>
            )}
          </fieldset>
        </form>
      )}

      {!showSearch && (
        <div className="bottom-actions">
          {!showSubmitBar ? (
            <>
              <button type="button" onClick={handleNew} >{t("new")}</button>
              <button
                type="button"
                onClick={() => setShowSearch(prev => !prev)}
              >
                {t("search")}
              </button>
              <button type="button" disabled={!selectedCustomerId} onClick={handleUpdate}>
                {t("update")}
              </button>
              <button type="button" className="exit-btn" onClick={handleExit}>{t("close")}</button>
            </>
          ) : (
            <>
              <button type="submit" form="onboarding-form" className="submit-btn" >
                {t("submit")}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                {t("cancel")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default CustomerOnboardingForm;