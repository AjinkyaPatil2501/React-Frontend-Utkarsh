import i18n from "i18next";
import { initReactI18next } from "react-i18next";


i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Login
        loginTitle: "Utkarsh",
        loginSubtitle: "Computerized Accounting System for Cooperative Societies",
        loginSociety: "Ajitdada Pawar Rural Biger Sheti Cooperative Society Limited",
        username: "Username",
        password: "Password",
        login: "Login",
        cancel: "Cancel",
        loggingIn: "Logging in...",
        invalidCredentials: "❌ Invalid username or password",
        loginBlocked: "❌ Login blocked: This account is locked to another device.",
        loginSuccess: "✅ Login successful! Redirecting...",
        loginFailed: "❌ Login failed.",
        serverError: "❌ Server error.",

        // Navbar
        operation: "Operation",
        master: "Master",
        customerMaster: "Customer Master",
        systemTools: "System Tools",
        user: "User",
        addUser: "Add User",
        controls: "Controls",
        logout: "Logout",
        hello: "Hello",
        sessionTimeout: "Session timed out due to inactivity. Please login again.",
        pleaseLoginAgain: "Please login again to continue.",

        // User Master
        addNewUser: "ADD NEW USER",
        editUser: "Edit User",
        adminPassword: "Administrative Password",
        photo: "Photo",
        bankName: "Bank Name",
        branchName: "Branch Name",
        userNumber: "User Number",
        shortName: "Short Name",
        designation: "User Designation",
        userName: "User Name",
        mobile: "Mobile Number",
        debitLimit: "Debit Amount Limit",
        cashier: "Cashier",
        teller: "Teller",
        passwordField: "Password",
        fromDate: "From Date",
        toDate: "To Date",
        fromTime: "From Time",
        toTime: "To Time",
        allowExtraTime: "Allow for Extra Time",

        //Buttons
        new: "New",
        search: "Search",
        submit: "Submit",
        update: "Update",
        delete: "Delete",
        close: "Close",
        confirm: "Confirm",


        // User Search
        find: "Find",
        byUserId: "By User_ID",
        byUserName: "By User_Name",
        enterUserId: "Enter User ID",
        enterUserName: "Enter User Name",
        searching: "Searching...",
        noRecords: "No records found.",
        back: "Back",
        bankNameCol: "Bank Name",
        branchNameCol: "Branch Name",
        idCol: "ID",
        shortNameCol: "Short Name",
        designationCol: "User Designation",
        userNameCol: "User Name",
        mobileCol: "Mobile Number",

        invalidBankName: "Bank is required",
        invalidBranchName: "Branch is required",
        invalidShortName: "Short name is required",
        invalidShortNameLength: "Short name must be exactly 2 characters",
        invalidDesignation: "Designation is required",
        invalidUserName: "User name is required",
        invalidMobile: "Mobile number is required",
        invalidMobileDigits: "Mobile number must be 10 digits",
        invalidDebitLimit: "Debit limit must be numeric",
        invalidPassword: "Password is required",
        invalidPasswordLength: "Password must be at least 6 characters",
        invalidFromDate: "From date is required",
        invalidToDate: "To date is required",
        invalidFromTime: "From time is required",
        invalidToTime: "To time is required",
        downloadPhotoConfirm: "Do you want to download this photo?",
        yes: "Yes",
        no: "No",
        selectBank: "Select Bank",
        selectBranch: "Select Branch",
        select: "Select",


        // ================= CUSTOMER ONBOARDING =================

        customerOnboarding: "Customer Onboarding",
        customerType: "Customer Type",
        individual: "Individual",
        company: "Company",


        // Customer Basic Info
        basicCustomerInformation: "Basic Customer Information",
        customerId: "Customer ID",
        customerTypeIndividual: "Individual",
        customerTypeCompany: "Company",

        // Customer Master
        personalInformation: "Personal Information",
        firstName: "First Name",
        middleName: "Middle Name",
        lastName: "Last Name",
        gender: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        dob: "Date of Birth",
        age: "Age",
        pan: "PAN Number",
        aadhaar: "Aadhaar Number",
        email: "Email",
        phone: "Mobile Number",
        fatherHusbandName: "Father / Husband Name",
        minor: "Minor",
        parentName: "Parent Name",

        // Address
        address: "Address",
        localAddress: "Local Address",
        permanentAddress: "Permanent Address",
        city: "City",
        state: "State",
        pincode: "Pincode",
        homeType: "Home Type",
        owned: "Owned",
        rented: "Rented",
        india: "India",
        maharashtra: "Maharashtra",


        // Business
        businessDetails: "Business Details",
        occupation: "Occupation",
        businessAddress: "Business Address",
        businessEmail: "Business Email",

        // KYC
        kycDetails: "KYC Details",
        documentType: "Document Type",
        documentNumber: "Document Number",

        // Assets
        assets: "Assets",
        assetName: "Asset Name",
        assetAmount: "Amount",
        annualIncome: "Annual Income",
        netWorth: "Net Worth",
        assetsSection: "Assets",
        amount: "Amount",
        add: "Add",
        usableLandAcre: "Usable Land (Acre)",
        usableLandGuntha: "Usable Land (Guntha)",
        totalLandAcre: "Total Land (Acre)",
        totalLandGuntha: "Total Land (Guntha)",
        eAgreementEndDate: "E‑Agreement End Date",


        // Company Details
        companyDetails: "Company Details",
        companyName: "Company Name",
        constitution: "Constitution",
        natureOfBusiness: "Nature of Business",
        estDate: "Establishment Date",
        panNo: "PAN Number",
        tanNo: "TAN Number",
        gstNo: "GST Number",
        salesNo: "Sales Tax Number",
        exciseNo: "Excise Number",
        faxNo: "Fax Number",
        partnersSection: "Partners",
        addPartner: "Add Partner",

        // Company Address
        companyAddress: "Company Address",

        // Company KYC
        companyKyc: "Company KYC",

        // Partners
        partners: "Partners",
        partnerName: "Partner Name",
        partnerPan: "Partner PAN",
        partnerMobile: "Partner Mobile",
        sharePercent: "Share Percentage",

        // Messages
        formDisabled: "Form is currently disabled",
        formEnabled: "Form is enabled",
        confirmExit: "Do you want to exit?",
        saveSuccess: "Data saved successfully",
        saveFailed: "Failed to save data",

        emailId1: "Email ID 1",
        emailId2: "Email ID 2",
        introducerId: "Introducer ID",

        education: "Education",
        ssc: "SSC",
        hsc: "HSC",
        graduate: "Graduate",
        postGraduate: "Post Graduate",

        maritalStatus: "Marital Status",
        single: "Single",
        married: "Married",
        divorced: "Divorced",

        religion: "Religion",
        hindu: "Hindu",
        muslim: "Muslim",
        christian: "Christian",
        sikh: "Sikh",

        caste: "Caste",
        general: "General",
        obc: "OBC",
        sc: "SC",
        st: "ST",
        subCaste: "Sub Caste",

        bloodGroup: "Blood Group",
        customerName: "Customer Name",
        uploadPhoto: "Upload Photo",
        openCamera: "📷 Open Camera",
        capture: "Capture",
        remove: " ❌ Remove",
        uploadSignature: "Upload Signature",

        addressDetails: "Address Details",
        country: "Country",
        district: "District",
        taluka: "Taluka",
        cityVillage: "City / Village",
        phoneNo1: "Phone No 1",
        phoneNo2: "Phone No 2",
        mobileNo1: "Mobile No 1",
        mobileNo2: "Mobile No 2",

        businessInformation: "Business Information",
        occupationType: "Occupation Type",
        farmer: "Farmer",
        service: "Service",

        kycDocuments: "KYC Documents",
        documentName: "Document Name",
        uploadImage: "Upload Image",
        save: "Save",
        name: "Name",
        number: "Number",

        companyFirmDetails: "Company / Firm Details",
        companyFirmName: "Company / Firm Name",
        soleProprietorship: "Sole Proprietorship",
        partnership: "Partnership",
        pvtLtd: "Pvt Ltd",
        dateOfEstablishment: "Date of Establishment",

        wardNo: "Ward No",
        website: "Website",

        GOVT: "Government",
        PRIVATE: "Private",
        BUSINESS: "Business",
        STUDENT: "Student",
        HOUSEWIFE: "Housewife",
        OCC1: "Retired",
        OTHER: "Other",

        // Deposit Master - Tabs
        generalTab: "General",
        personalInfoTab: "Personal Information",
        financialInfoTab: "Financial Information",
        depositTab: "Deposit",
        savingsCurrentTab: "Savings | Current Account",

        // Tab 1 - General (Exact Match)
        khatavniKramank: "Ledger Number", // Khatavni Kramank
        khateKramank: "Account Number", // Khate Kramank
        grahakKramank: "Customer Number", // Grahak Kramank
        grahakachiMahiti: "Customer Info", // Grahakachi Mahiti
        sanchalakKramank: "Director No", // Sanchalak Kramank
        englishName: "English Name",
        sabhasadPrakar: "Member Type", // Sabhasad Prakar
        sabhasadNumber: "Member Number", // Sabhasad Number
        prakar: "Type", // Prakar
        samayikKhate: "Joint Account", // Samayik Khate
        // customerName: "Customer Name", // Grahakache Nav

        // Tab 2 - Personal Information (Exact Match)
        patta: "Address", // Patta
        shahar: "City", // Shahar
        // phone: "Phone",
        visheshShuchna: "Special Instruction", // Vishesh Shuchna
        varsacheNav: "Nominee Name", // Varsache Nav
        varsachiMahiti: "Nominee Info", // Varsachi Mahiti (Button)
        olakhnaryacheNav: "Introducer Name", // Olkahnarycahe nav
        olakhnaryachaPatta: "Introducer Address", // Olakhnaryracha patta
        olakhnaryacheGavShahar: "Introducer City", // Olkahnarycaha gav/ shahar
        checkPustak: "Check Book", // Check pustak
        form15H: "Form 15 H",
        sms: "S.M.S.",

        // Tab 3 - Financial Information (Exact Match)
        suruvatichiDinak: "Start Date", // Suruvatichi Dinak
        asOnDate: "As on Date",
        kalavadhi: "Period", // Kalavadhi
        mahine: "Months",
        divas: "Days",
        shevatchiDinak: "End Date", // Shevatchi Dinak
        interestFrequency: "Interest Frequency", // Vyaj Varga Kalavadhi
        thevnichiRakkam: "Deposit Amount Rs.", // Thevnichi Rakkam Ru.
        vyajachaDar: "Interest Rate %", // Vyajacha Dar %
        mudatiantanDeyaRakkam: "Maturity Amount", // Mudatiantan Deya Rakkam
        autoRenewal: "Auto Renewal", // Purnaguntavnuk
        vyajasaha: "With Interest", // Vyajasaha
        vyajVargaKhtavni: "Interest TRF. GL", // Vyaj Varga Khtavni
        vyajVargaKhate: "Interest TRF. SL", // Vyaj Varga Khate
        vasuliPatrakatGhyayacheKa: "Process in Recovery ", // Vasuli patrakat ghyayache ka?

        // Tab 4 - Deposit (Exact Match)
        thevPavtiKramank: "FD Receipt No ", // Thev Pavti Kramank
        vyajKadhayacheKa: "Interest Applicable ", // Vyaj Kadhayache Ka?
        chapaiKeli: "Print FD ", // Chapai Keli

        // Tab 5 - Savings/Current Account (Exact Match)
        totalSavings: "Total Savings",
        tatpurteKarj: "Allow TOD ", // Tatpurte Karj
        tatpurteKarjMaryada: "TOD Limit ", // Tatpurte Karj Maryada
        tatpurteKarjVyaj: "TOD Int ", // Tatpurte Karj Vyaj
        tatpurteKarjAntimDinak: "TOD Due Date ", // Tatpurte Karj Antim Dinak
        vasuliKaraychiKa: "Process Recovery?", // Vasuli karaychi ka?

        // Common
        print: "Print",
        comingSoon: "Coming Soon...",
        renewAccount: "Renew Account",

        // Deposit Master
        depositMaster: "Deposit Master",
        depositInformation: "Deposit Information",
        accountNumber: "Account Number",
        accountHolderName: "Account Holder Name",
        depositType: "Deposit Type",
        openingDate: "Opening Date",
        maturityDate: "Maturity Date",
        depositAmount: "Deposit Amount",
        interestRate: "Interest Rate (%)",
        maturityAmount: "Maturity Amount",
        nomineeName: "Nominee Name",
        nomineeRelation: "Nominee Relation",
        monthlyInstallment: "Monthly Installment",
        termMonths: "Term (Months)",
        fixedDeposit: "Fixed Deposit",
        recurringDeposit: "Recurring Deposit",
        savingsAccount: "Savings Account",
        active: "Active",
        matured: "Matured",
        closed: "Closed",
        agentCode: "Agent Code",
        searchgl: "Find General Ledger",


        errors: {
          required: "{{field}} is required",
          pleaseFillRequired: "Please fill all required fields",
          invalidEmail: "Invalid email format",
          invalidPAN: "Invalid PAN format",
          invalidDOB: "Invalid date of birth",
          futureDOB: "Date of birth cannot be in the future",
          phoneDigits: "Phone number must be 10 digits",
          aadhaarDigits: "Aadhaar must be 12 digits",
          numberOnly: "{{field}} must contain only digits"
        },
        title: "Title",
        accountOpeningDate: "Acc. Opening Date",
        searchCustomer: "Search customer",
      }
    },
    mr: {
      translation: {
        // Marathi translations (example)
        loginTitle: "उत्कर्ष",
        loginSubtitle: "सहकारी संस्थांसाठी संगणकीकृत लेखा प्रणाली",
        loginSociety: "अजितदादा पवार ग्रामीण बिगर शेती सहकारी संस्था लिमिटेड",
        username: "वापरकर्ता नाव",
        password: "संकेतशब्द",
        login: "लॉगिन",
        cancel: "रद्द करा",
        loggingIn: "लॉगिन करत आहे...",
        invalidCredentials: "❌ चुकीचे नाव किंवा संकेतशब्द",
        loginBlocked: "❌ लॉगिन ब्लॉक: हे खाते दुसऱ्या उपकरणावर लॉक आहे.",
        loginSuccess: "✅ लॉगिन यशस्वी! पुनर्निर्देशित करत आहे...",
        loginFailed: "❌ लॉगिन अयशस्वी.",
        serverError: "❌ सर्व्हर त्रुटी.",

        operation: "ऑपरेशन",
        master: "मास्टर",
        customerMaster: "ग्राहक मास्टर",
        systemTools: "सिस्टम साधने",
        user: "वापरकर्ता",
        addUser: "वापरकर्ता जोडा",
        controls: "नियंत्रणे",
        logout: "लॉगआउट",
        hello: "नमस्कार",
        customerName: "ग्राहकाचे नाव",
        sessionTimeout: "क्रियाशीलता नसल्यामुळे सत्र संपले. कृपया पुन्हा लॉगिन करा.",
        pleaseLoginAgain: "सुरू ठेवण्यासाठी कृपया पुन्हा लॉगिन करा.",

        addNewUser: "नवीन वापरकर्ता जोडा",
        editUser: "वापरकर्ता संपादित करा",
        adminPassword: "प्रशासकीय संकेतशब्द",
        photo: "छायाचित्र",
        bankName: "बँकेचे नाव",
        branchName: "शाखेचे नाव",
        userNumber: "वापरकर्ता क्रमांक",
        shortName: "संक्षिप्त नाव",
        designation: "पदनाम",
        userName: "वापरकर्त्याचे नाव",
        mobile: "मोबाईल क्रमांक",
        debitLimit: "डेबिट मर्यादा",
        cashier: "कॅशियर",
        teller: "टेलर",
        passwordField: "संकेतशब्द",
        fromDate: "पासून तारीख",
        toDate: "पर्यंत तारीख",
        fromTime: "पासून वेळ",
        toTime: "पर्यंत वेळ",
        allowExtraTime: "अतिरिक्त वेळ परवानगी द्या",

        // Buttons
        new: "नवीन",
        search: "शोधा",
        submit: "जतन करा",
        update: "संपादित करा",
        delete: "हटवा",
        close: "बंद करा",
        confirm: "निश्चित करा",
        find: "शोधा",


        byUserId: "वापरकर्ता आयडीने",
        byUserName: "वापरकर्ता नावाने",
        enterUserId: "वापरकर्ता आयडी प्रविष्ट करा",
        enterUserName: "वापरकर्ता नाव प्रविष्ट करा",
        searching: "शोधत आहे...",
        noRecords: "नोंदी सापडल्या नाहीत.",
        back: "मागे",
        bankNameCol: "बँकेचे नाव",
        branchNameCol: "शाखेचे नाव",
        idCol: "आयडी",
        shortNameCol: "संक्षिप्त नाव",
        designationCol: "पदनाम",
        userNameCol: "वापरकर्त्याचे नाव",
        mobileCol: "मोबाईल क्रमांक",

        invalidBankName: "कृपया बँक निवडा",
        invalidBranchName: "कृपया शाखा निवडा",
        invalidShortName: "संक्षिप्त नाव आवश्यक आहे",
        invalidShortNameLength: "संक्षिप्त नाव नेमके 2 अक्षरे असणे आवश्यक आहे",
        invalidDesignation: "पदनाम आवश्यक आहे",
        invalidUserName: "वापरकर्त्याचे नाव आवश्यक आहे",
        invalidMobile: "मोबाईल क्रमांक आवश्यक आहे",
        invalidMobileDigits: "मोबाईल क्रमांक 10 अंकांचा असणे आवश्यक आहे",
        invalidDebitLimit: "डेबिट मर्यादा फक्त अंक असणे आवश्यक आहे",
        invalidPassword: "संकेतशब्द आवश्यक आहे",
        invalidPasswordLength: "संकेतशब्द किमान 6 अक्षरे असणे आवश्यक आहे",
        invalidFromDate: "पासून तारीख आवश्यक आहे",
        invalidToDate: "पर्यंत तारीख आवश्यक आहे",
        invalidFromTime: "पासून वेळ आवश्यक आहे",
        invalidToTime: "पर्यंत वेळ आवश्यक आहे",
        downloadPhotoConfirm: "आपण हे फोटो डाउनलोड करू इच्छिता?",
        yes: "हो",
        no: "नाही",
        selectBank: "बँक निवडा",
        selectBranch: "शाखा निवडा",
        select: "निवडा",

        // ================= CUSTOMER ONBOARDING =================

        customerOnboarding: "ग्राहक नोंदणी",
        customerType: "ग्राहक प्रकार",
        individual: "वैयक्तिक",
        company: "संस्था",


        // Customer Basic Info
        basicCustomerInformation: "मूलभूत ग्राहक माहिती",
        customerId: "ग्राहक आयडी",
        customerTypeIndividual: "वैयक्तिक",
        customerTypeCompany: "संस्था",

        // Customer Master
        personalInformation: "वैयक्तिक माहिती",
        firstName: "पहिले नाव",
        middleName: "मधले नाव",
        lastName: "आडनाव",
        gender: "लिंग",
        male: "पुरुष",
        female: "स्त्री",
        other: "इतर",
        dob: "जन्मतारीख",
        age: "वय",
        pan: "पॅन क्रमांक",
        aadhaar: "आधार क्रमांक",
        email: "ई-मेल",
        phone: "मोबाईल क्रमांक",
        fatherHusbandName: "वडील / पतीचे नाव",
        minor: "अल्पवयीन",
        parentName: "पालकांचे नाव",


        // Address
        address: "पत्ता",
        localAddress: "स्थानिक पत्ता",
        permanentAddress: "कायमचा पत्ता",
        city: "शहर",
        state: "राज्य",
        pincode: "पिनकोड",
        homeType: "घराचा प्रकार",
        owned: "स्वतःचे",
        rented: "भाड्याचे",
        india: "भारत",
        maharashtra: "महाराष्ट्र",

        // Business
        businessDetails: "व्यवसाय माहिती",
        occupation: "व्यवसाय",
        businessAddress: "व्यवसायाचा पत्ता",
        businessEmail: "व्यवसाय ई-मेल",

        // KYC
        kycDetails: "केवायसी माहिती",
        documentType: "दस्तऐवज प्रकार",
        documentNumber: "दस्तऐवज क्रमांक",

        // Assets
        assets: "मालमत्ता",
        assetName: "मालमत्तेचे नाव",
        assetAmount: "रक्कम",
        annualIncome: "वार्षिक उत्पन्न",
        netWorth: "एकूण संपत्ती",
        assetsSection: "मालमत्ता",
        amount: "रक्कम",
        add: "जोडा",
        usableLandAcre: "उपयोगी जमीन (एकर)",
        usableLandGuntha: "उपयोगी जमीन (गुंठा)",
        totalLandAcre: "एकूण जमीन (एकर)",
        totalLandGuntha: "एकूण जमीन (गुंठा)",
        eAgreementEndDate: "ई‑एग्रीमेंट समाप्ती तारीख",


        // Company Details
        companyDetails: "संस्थेची माहिती",
        companyName: "संस्थेचे नाव",
        constitution: "घटनात्मक प्रकार",
        natureOfBusiness: "व्यवसायाचा प्रकार",
        estDate: "स्थापनेची तारीख",
        panNo: "पॅन क्रमांक",
        tanNo: "टॅन क्रमांक",
        gstNo: "जीएसटी क्रमांक",
        salesNo: "विक्री कर क्रमांक",
        exciseNo: "एक्साईज क्रमांक",
        faxNo: "फॅक्स क्रमांक",
        partnersSection: "भागीदार",
        addPartner: "भागीदार जोडा",

        // Company Address
        companyAddress: "संस्थेचा पत्ता",
        companyFirmDetails: "कंपनी / फर्म तपशील",
        companyFirmName: "कंपनी / फर्मचे नाव",
        soleProprietorship: "एकल मालकी",
        partnership: "भागीदारी",
        pvtLtd: "खाजगी मर्यादित",
        dateOfEstablishment: "स्थापनेची तारीख",

        // Company KYC
        companyKyc: "संस्थेचे केवायसी",

        // Partners
        partners: "भागीदार",
        partnerName: "भागीदाराचे नाव",
        partnerPan: "भागीदार पॅन",
        partnerMobile: "भागीदार मोबाईल",
        sharePercent: "हिस्सा टक्केवारी",

        // Common Messages
        formDisabled: "फॉर्म सध्या बंद आहे",
        formEnabled: "फॉर्म सुरू आहे",
        confirmExit: "आपण बाहेर पडू इच्छिता का?",
        saveSuccess: "माहिती यशस्वीरीत्या जतन झाली",
        saveFailed: "माहिती जतन करण्यात अयशस्वी",

        emailId1: "ई-मेल आयडी १",
        emailId2: "ई-मेल आयडी २",
        introducerId: "ओळख करून देणाऱ्याचा आयडी",

        education: "शिक्षण",
        ssc: "एसएससी",
        hsc: "एचएससी",
        graduate: "पदवीधर",
        postGraduate: "पदव्युत्तर",

        maritalStatus: "वैवाहिक स्थिती",
        single: "अविवाहित",
        married: "विवाहित",
        divorced: "घटस्फोटीत",

        religion: "धर्म",
        hindu: "हिंदू",
        muslim: "मुस्लिम",
        christian: "ख्रिश्चन",
        sikh: "शीख",

        caste: "जात",
        general: "सामान्य",
        obc: "ओबीसी",
        sc: "अनुसूचित जात",
        st: "अनुसूचित जमात",
        subCaste: "उपजात",

        bloodGroup: "रक्तगट",

        uploadPhoto: "फोटो अपलोड करा",
        openCamera: "कॅमेरा उघडा",
        capture: "फोटो घ्या",
        remove: "काढून टाका",
        uploadSignature: "स्वाक्षरी अपलोड करा",

        addressDetails: "पत्त्याची माहिती",
        country: "देश",
        district: "जिल्हा",
        taluka: "तालुका",
        cityVillage: "शहर / गाव",
        phoneNo1: "फोन क्रमांक १",
        phoneNo2: "फोन क्रमांक २",
        mobileNo1: "मोबाईल क्रमांक १",
        mobileNo2: "मोबाईल क्रमांक २",

        businessInformation: "व्यवसायाची माहिती",
        occupationType: "व्यवसायाचा प्रकार",
        farmer: "शेतकरी",
        service: "नोकरी",

        kycDocuments: "केवायसी दस्तऐवज",
        documentName: "दस्तऐवजाचे नाव",
        uploadImage: "प्रतिमा अपलोड करा",
        save: "जतन करा",
        name: "नाव",
        number: "क्रमांक",

        wardNo: "वॉर्ड क्रमांक",
        website: "संकेतस्थळ",

        GOVT: "शासकीय",
        PRIVATE: "खाजगी",
        BUSINESS: "व्यवसाय",
        STUDENT: "विद्यार्थी",
        HOUSEWIFE: "गृहिणी",
        OCC1: "निवृत्त",
        OTHER: "इतर",

        // Deposit Master - Tabs
        generalTab: "जनरल",
        personalInfoTab: "वैयक्तिक माहिती",
        financialInfoTab: "आर्थिक माहिती",
        depositTab: "ठेव",
        savingsCurrentTab: "बचत आणि चालू खाते माहिती",

        // Tab 1 - General (Exact Match)
        khatavniKramank: "खतावणी क्रमांक",
        khateKramank: "खाते क्रमांक",
        grahakKramank: "ग्राहक क्रमांक",
        grahakachiMahiti: "ग्राहकाची माहिती",
        sanchalakKramank: "संचालक क्र.",

        sabhasadPrakar: "सभासद प्रकार",
        sabhasadNumber: "सभासद नंबर",
        prakar: "प्रकार",
        samayikKhate: "सामाईक खाते",
        // customerName: "ग्राहकाचे नाव",

        // Tab 2 - Personal Information
        patta: "पत्ता",
        shahar: "शहर",
        // phone: "फोन",
        visheshShuchna: "विशेष सुचना",
        varsacheNav: "वारसाचे नाव",
        varsachiMahiti: "वारसाची माहिती",
        olakhnaryacheNav: "ओळखणाऱ्याचे नाव",
        olakhnaryachaPatta: "ओळखणाऱ्याचा पत्ता",
        olakhnaryacheGavShahar: "ओळखणाऱ्याचे गाव | शहर",
        checkPustak: "चेक पुस्तक",
        form15H: "फॉर्म १५ एच",
        sms: "एस.एम.एस",

        // Tab 3 - Financial Information (Exact Match)
        suruvatichiDinak: "सुरुवातीची दिनांक",
        asOnDate: "अॅज ऑन डेट", // Matches Screenshot transliteration
        kalavadhi: "कालावधी",
        mahine: "महिने",
        divas: "दिवस",
        shevatchiDinak: "शेवटची दिनांक",
        interestFrequency: "व्याज वर्ग कालावधी",
        thevnichiRakkam: "ठेवीची रक्कम रु.",
        vyajachaDar: "व्याजाचा दर %",
        mudatiantanDeyaRakkam: "मुदतीअंती देय रक्कम",
        autoRenewal: "पुर्नगुंतवणुक",
        vyajasaha: "व्याजासह",
        vyajVargaKhtavni: "व्याज वर्ग खतावणी",
        vyajVargaKhate: "व्याज वर्ग खाते",
        vasuliPatrakatGhyayacheKa: "वसुली पत्रकात घ्यावयाचे का ?",

        // Tab 4 - Deposit (Exact Match)
        thevPavtiKramank: "ठेव पावती क्रमांक",
        vyajKadhayacheKa: "व्याज काढायचे का ?",
        chapaiKeli: "छपाई केली",

        // Tab 5 - Savings/Current Account (Exact Match)
        totalSavings: "एकूण बचत",
        tatpurteKarj: "तात्पुरते कर्ज",
        tatpurteKarjMaryada: "तात्पुरते कर्ज मर्यादा",
        tatpurteKarjVyaj: "तात्पुरते कर्ज व्याज",
        tatpurteKarjAntimDinak: "तात्पुरते कर्ज अंतीम दिनांक",
        vasuliKaraychiKa: "वसुली करायची का ?",

        // Common
        print: "प्रिंट",
        comingSoon: "लवकरच येत आहे...",
        renewAccount: "रिन्यू अकाउंट",

        // Deposit Master
        depositMaster: "ठेव मास्टर",
        depositInformation: "ठेव माहिती",
        accountNumber: "खाते क्रमांक",
        accountHolderName: "खातेदाराचे नाव",
        depositType: "ठेव प्रकार",
        openingDate: "उघडण्याची तारीख",
        maturityDate: "परिपक्वता तारीख",
        depositAmount: "ठेव रक्कम",
        interestRate: "व्याज दर (%)",
        maturityAmount: "परिपक्वता रक्कम",
        nomineeName: "नामनिर्देशिताचे नाव",
        nomineeRelation: "नामनिर्देशिताचे नाते",
        monthlyInstallment: "मासिक हप्ता",
        termMonths: "मुदत (महिने)",
        fixedDeposit: "मुदत ठेव",
        recurringDeposit: "आवर्ती ठेव",
        savingsAccount: "बचत खाते",
        active: "सक्रिय",
        matured: "परिपक्व",
        closed: "बंद",
        agentCode: "प्रतिनिधी क्रमांक",
        searchgl: "जनरल लेजर शोधा",


        errors: {
          required: "{{field}} आवश्यक आहे",
          pleaseFillRequired: "कृपया सर्व आवश्यक फील्ड भरा.",
          invalidEmail: "अवैध ईमेल फॉरमॅट",
          invalidPAN: "अवैध पॅन फॉरमॅट",
          invalidDOB: "अवैध जन्म तारीख",
          futureDOB: "जन्म तारीख भविष्यातली असू शकत नाही",
          phoneDigits: "फोन नंबर 10 अंकांचा असावा",
          aadhaarDigits: "आधार 12 अंकांचा असावा",
          numberOnly: "{{field}} मध्ये फक्त अंक असावे"
        },
        title: "उपाधी",
        accountOpeningDate: "खाते उघडण्याची तारीख",
        searchCustomer: "ग्राहक शोधा",
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
