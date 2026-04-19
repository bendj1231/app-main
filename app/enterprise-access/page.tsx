'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnterpriseAccessPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        businessType: '',
        typeRatingProvider: false,
        airlineRecruiter: false,
        staffingFirm: false,
        recruitmentAgency: false,
        manufacturer: false,
        ato: false,
        operator: false,
        website: '',
        companySize: '',
        country: '',
        businessRegistration: '',
        partnershipInterest: '',
        pathwayInterests: [] as string[],
        customPathway: '',
        timeline: '',
        budgetRange: '',
        dataInput: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Format the email body
        const emailBody = `
Enterprise Access Request

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}

Company Information:
- Company: ${formData.company}
- Role: ${formData.role}
- Website: ${formData.website}
- Company Size: ${formData.companySize}
- Country: ${formData.country}

Organization Type:
- Airline Operator: ${formData.operator ? 'Yes' : 'No'}
- Aircraft Manufacturer: ${formData.manufacturer ? 'Yes' : 'No'}
- ATO / Training Provider: ${formData.ato ? 'Yes' : 'No'}
- Type Rating Center: ${formData.typeRatingProvider ? 'Yes' : 'No'}
- Airline Recruiter: ${formData.airlineRecruiter ? 'Yes' : 'No'}
- Staffing Firm: ${formData.staffingFirm ? 'Yes' : 'No'}
- Recruitment Agency: ${formData.recruitmentAgency ? 'Yes' : 'No'}

Partnership Interest:
- What do you do: ${formData.businessType}
- Partnership Interest: ${formData.partnershipInterest}
- Pathway Interests: ${formData.pathwayInterests.join(', ')}
- Custom Pathway: ${formData.customPathway || 'N/A'}
- Timeline: ${formData.timeline}
- Data Input Requirements: ${formData.dataInput || 'N/A'}

Additional Information:
- Partnership Goals: ${formData.message}
        `.trim();

        // Open email client with pre-filled data
        const mailtoLink = `mailto:enterprise@pilotrecognition.com?subject=Enterprise Access Request - ${formData.company}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, value } = e.target;
        if (name === 'pathwayInterests') {
            setFormData(prev => ({
                ...prev,
                pathwayInterests: checked
                    ? [...prev.pathwayInterests, value]
                    : prev.pathwayInterests.filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-slate-900 px-8 py-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Enterprise Access
                        </h1>
                        <p className="text-blue-200 text-lg">
                            Access the Verified Pilot Recognition Database & Industry Pathways
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                                Contact Information
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                                Company Information
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Your Role *
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g., CEO, HR Manager, Recruiter, Head of Training"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Website URL (optional)
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="https://yourcompany.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Company Size *
                                </label>
                                <select
                                    name="companySize"
                                    required
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select company size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Country *
                                </label>
                                <select
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select country</option>
                                    <option value="AF">Afghanistan</option>
                                    <option value="AL">Albania</option>
                                    <option value="DZ">Algeria</option>
                                    <option value="AS">American Samoa</option>
                                    <option value="AD">Andorra</option>
                                    <option value="AO">Angola</option>
                                    <option value="AI">Anguilla</option>
                                    <option value="AQ">Antarctica</option>
                                    <option value="AG">Antigua and Barbuda</option>
                                    <option value="AR">Argentina</option>
                                    <option value="AM">Armenia</option>
                                    <option value="AW">Aruba</option>
                                    <option value="AU">Australia</option>
                                    <option value="AT">Austria</option>
                                    <option value="AZ">Azerbaijan</option>
                                    <option value="BS">Bahamas</option>
                                    <option value="BH">Bahrain</option>
                                    <option value="BD">Bangladesh</option>
                                    <option value="BB">Barbados</option>
                                    <option value="BY">Belarus</option>
                                    <option value="BE">Belgium</option>
                                    <option value="BZ">Belize</option>
                                    <option value="BJ">Benin</option>
                                    <option value="BM">Bermuda</option>
                                    <option value="BT">Bhutan</option>
                                    <option value="BO">Bolivia</option>
                                    <option value="BA">Bosnia and Herzegovina</option>
                                    <option value="BW">Botswana</option>
                                    <option value="BV">Bouvet Island</option>
                                    <option value="BR">Brazil</option>
                                    <option value="IO">British Indian Ocean Territory</option>
                                    <option value="BN">Brunei Darussalam</option>
                                    <option value="BG">Bulgaria</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="BI">Burundi</option>
                                    <option value="KH">Cambodia</option>
                                    <option value="CM">Cameroon</option>
                                    <option value="CA">Canada</option>
                                    <option value="CV">Cape Verde</option>
                                    <option value="KY">Cayman Islands</option>
                                    <option value="CF">Central African Republic</option>
                                    <option value="TD">Chad</option>
                                    <option value="CL">Chile</option>
                                    <option value="CN">China</option>
                                    <option value="CX">Christmas Island</option>
                                    <option value="CC">Cocos (Keeling) Islands</option>
                                    <option value="CO">Colombia</option>
                                    <option value="KM">Comoros</option>
                                    <option value="CG">Congo</option>
                                    <option value="CD">Congo, The Democratic Republic of the</option>
                                    <option value="CK">Cook Islands</option>
                                    <option value="CR">Costa Rica</option>
                                    <option value="CI">Cote d'Ivoire</option>
                                    <option value="HR">Croatia</option>
                                    <option value="CU">Cuba</option>
                                    <option value="CY">Cyprus</option>
                                    <option value="CZ">Czech Republic</option>
                                    <option value="DK">Denmark</option>
                                    <option value="DJ">Djibouti</option>
                                    <option value="DM">Dominica</option>
                                    <option value="DO">Dominican Republic</option>
                                    <option value="EC">Ecuador</option>
                                    <option value="EG">Egypt</option>
                                    <option value="SV">El Salvador</option>
                                    <option value="GQ">Equatorial Guinea</option>
                                    <option value="ER">Eritrea</option>
                                    <option value="EE">Estonia</option>
                                    <option value="ET">Ethiopia</option>
                                    <option value="FK">Falkland Islands (Malvinas)</option>
                                    <option value="FO">Faroe Islands</option>
                                    <option value="FJ">Fiji</option>
                                    <option value="FI">Finland</option>
                                    <option value="FR">France</option>
                                    <option value="GF">French Guiana</option>
                                    <option value="PF">French Polynesia</option>
                                    <option value="TF">French Southern Territories</option>
                                    <option value="GA">Gabon</option>
                                    <option value="GM">Gambia</option>
                                    <option value="GE">Georgia</option>
                                    <option value="DE">Germany</option>
                                    <option value="GH">Ghana</option>
                                    <option value="GI">Gibraltar</option>
                                    <option value="GR">Greece</option>
                                    <option value="GL">Greenland</option>
                                    <option value="GD">Grenada</option>
                                    <option value="GP">Guadeloupe</option>
                                    <option value="GU">Guam</option>
                                    <option value="GT">Guatemala</option>
                                    <option value="GG">Guernsey</option>
                                    <option value="GN">Guinea</option>
                                    <option value="GW">Guinea-Bissau</option>
                                    <option value="GY">Guyana</option>
                                    <option value="HT">Haiti</option>
                                    <option value="HM">Heard Island and McDonald Islands</option>
                                    <option value="VA">Holy See (Vatican City State)</option>
                                    <option value="HN">Honduras</option>
                                    <option value="HK">Hong Kong</option>
                                    <option value="HU">Hungary</option>
                                    <option value="IS">Iceland</option>
                                    <option value="IN">India</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="IR">Iran, Islamic Republic of</option>
                                    <option value="IQ">Iraq</option>
                                    <option value="IE">Ireland</option>
                                    <option value="IM">Isle of Man</option>
                                    <option value="IL">Israel</option>
                                    <option value="IT">Italy</option>
                                    <option value="JM">Jamaica</option>
                                    <option value="JP">Japan</option>
                                    <option value="JE">Jersey</option>
                                    <option value="JO">Jordan</option>
                                    <option value="KZ">Kazakhstan</option>
                                    <option value="KE">Kenya</option>
                                    <option value="KI">Kiribati</option>
                                    <option value="KP">Korea, Democratic People's Republic of</option>
                                    <option value="KR">Korea, Republic of</option>
                                    <option value="KW">Kuwait</option>
                                    <option value="KG">Kyrgyzstan</option>
                                    <option value="LA">Lao People's Democratic Republic</option>
                                    <option value="LV">Latvia</option>
                                    <option value="LB">Lebanon</option>
                                    <option value="LS">Lesotho</option>
                                    <option value="LR">Liberia</option>
                                    <option value="LY">Libyan Arab Jamahiriya</option>
                                    <option value="LI">Liechtenstein</option>
                                    <option value="LT">Lithuania</option>
                                    <option value="LU">Luxembourg</option>
                                    <option value="MO">Macao</option>
                                    <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                                    <option value="MG">Madagascar</option>
                                    <option value="MW">Malawi</option>
                                    <option value="MY">Malaysia</option>
                                    <option value="MV">Maldives</option>
                                    <option value="ML">Mali</option>
                                    <option value="MT">Malta</option>
                                    <option value="MH">Marshall Islands</option>
                                    <option value="MQ">Martinique</option>
                                    <option value="MR">Mauritania</option>
                                    <option value="MU">Mauritius</option>
                                    <option value="YT">Mayotte</option>
                                    <option value="MX">Mexico</option>
                                    <option value="FM">Micronesia, Federated States of</option>
                                    <option value="MD">Moldova, Republic of</option>
                                    <option value="MC">Monaco</option>
                                    <option value="MN">Mongolia</option>
                                    <option value="ME">Montenegro</option>
                                    <option value="MS">Montserrat</option>
                                    <option value="MA">Morocco</option>
                                    <option value="MZ">Mozambique</option>
                                    <option value="MM">Myanmar</option>
                                    <option value="NA">Namibia</option>
                                    <option value="NR">Nauru</option>
                                    <option value="NP">Nepal</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="AN">Netherlands Antilles</option>
                                    <option value="NC">New Caledonia</option>
                                    <option value="NZ">New Zealand</option>
                                    <option value="NI">Nicaragua</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="NU">Niue</option>
                                    <option value="NF">Norfolk Island</option>
                                    <option value="MP">Northern Mariana Islands</option>
                                    <option value="NO">Norway</option>
                                    <option value="OM">Oman</option>
                                    <option value="PK">Pakistan</option>
                                    <option value="PW">Palau</option>
                                    <option value="PS">Palestinian Territory, Occupied</option>
                                    <option value="PA">Panama</option>
                                    <option value="PG">Papua New Guinea</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="PE">Peru</option>
                                    <option value="PH">Philippines</option>
                                    <option value="PN">Pitcairn</option>
                                    <option value="PL">Poland</option>
                                    <option value="PT">Portugal</option>
                                    <option value="PR">Puerto Rico</option>
                                    <option value="QA">Qatar</option>
                                    <option value="RE">Reunion</option>
                                    <option value="RO">Romania</option>
                                    <option value="RU">Russian Federation</option>
                                    <option value="RW">Rwanda</option>
                                    <option value="SH">Saint Helena</option>
                                    <option value="KN">Saint Kitts and Nevis</option>
                                    <option value="LC">Saint Lucia</option>
                                    <option value="PM">Saint Pierre and Miquelon</option>
                                    <option value="VC">Saint Vincent and the Grenadines</option>
                                    <option value="WS">Samoa</option>
                                    <option value="SM">San Marino</option>
                                    <option value="ST">Sao Tome and Principe</option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="SN">Senegal</option>
                                    <option value="RS">Serbia</option>
                                    <option value="SC">Seychelles</option>
                                    <option value="SL">Sierra Leone</option>
                                    <option value="SG">Singapore</option>
                                    <option value="SK">Slovakia</option>
                                    <option value="SI">Slovenia</option>
                                    <option value="SB">Solomon Islands</option>
                                    <option value="SO">Somalia</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                                    <option value="ES">Spain</option>
                                    <option value="LK">Sri Lanka</option>
                                    <option value="SD">Sudan</option>
                                    <option value="SR">Suriname</option>
                                    <option value="SJ">Svalbard and Jan Mayen</option>
                                    <option value="SZ">Swaziland</option>
                                    <option value="SE">Sweden</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="SY">Syrian Arab Republic</option>
                                    <option value="TW">Taiwan, Province of China</option>
                                    <option value="TJ">Tajikistan</option>
                                    <option value="TZ">Tanzania, United Republic of</option>
                                    <option value="TH">Thailand</option>
                                    <option value="TL">Timor-Leste</option>
                                    <option value="TG">Togo</option>
                                    <option value="TK">Tokelau</option>
                                    <option value="TO">Tonga</option>
                                    <option value="TT">Trinidad and Tobago</option>
                                    <option value="TN">Tunisia</option>
                                    <option value="TR">Turkey</option>
                                    <option value="TM">Turkmenistan</option>
                                    <option value="TC">Turks and Caicos Islands</option>
                                    <option value="TV">Tuvalu</option>
                                    <option value="UG">Uganda</option>
                                    <option value="UA">Ukraine</option>
                                    <option value="AE">United Arab Emirates</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="UM">United States Minor Outlying Islands</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="UZ">Uzbekistan</option>
                                    <option value="VU">Vanuatu</option>
                                    <option value="VE">Venezuela</option>
                                    <option value="VN">Viet Nam</option>
                                    <option value="VG">Virgin Islands, British</option>
                                    <option value="VI">Virgin Islands, U.S.</option>
                                    <option value="WF">Wallis and Futuna</option>
                                    <option value="EH">Western Sahara</option>
                                    <option value="YE">Yemen</option>
                                    <option value="ZM">Zambia</option>
                                    <option value="ZW">Zimbabwe</option>
                                </select>
                            </div>
                        </div>

                        {/* Organization Type */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                                Organization Type
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="operator"
                                        checked={formData.operator}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Airline Operator</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="manufacturer"
                                        checked={formData.manufacturer}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Aircraft Manufacturer</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="ato"
                                        checked={formData.ato}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">ATO / Training Provider</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="typeRatingProvider"
                                        checked={formData.typeRatingProvider}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Type Rating Center</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="airlineRecruiter"
                                        checked={formData.airlineRecruiter}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Airline Recruiter</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="staffingFirm"
                                        checked={formData.staffingFirm}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Staffing Firm</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="recruitmentAgency"
                                        checked={formData.recruitmentAgency}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">Recruitment Agency</span>
                                </label>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                                Partnership Interest
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    What do you do? *
                                </label>
                                <textarea
                                    name="businessType"
                                    required
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Describe your role and responsibilities"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Partnership Interest *
                                </label>
                                <select
                                    name="partnershipInterest"
                                    required
                                    value={formData.partnershipInterest}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select partnership interest</option>
                                    <option value="pilot-database">Verified Pilot Recognition Database Access</option>
                                    <option value="pathways-access">Access to Pathways System</option>
                                    <option value="platform-access">Platform Access - Post Jobs & Expectations</option>
                                    <option value="technology-integration">Technology Integration (HINFACT, ATLAS CV)</option>
                                    <option value="mentorship-program">Mentorship Program Access</option>
                                    <option value="inquiry">General Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Pathway Interests (Select all that apply) *
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="cadet-programs"
                                            checked={formData.pathwayInterests.includes('cadet-programs')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Cadet Programs</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="type-ratings"
                                            checked={formData.pathwayInterests.includes('type-ratings')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Type Rating Pathways</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="license-pathways"
                                            checked={formData.pathwayInterests.includes('license-pathways')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">License Pathways (ATPL)</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="business-aviation"
                                            checked={formData.pathwayInterests.includes('business-aviation')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Business Aviation</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="cargo-operations"
                                            checked={formData.pathwayInterests.includes('cargo-operations')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Cargo Operations</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="evtol-emerging"
                                            checked={formData.pathwayInterests.includes('evtol-emerging')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">eVTOL & Emerging Aviation</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="specialized-operations"
                                            checked={formData.pathwayInterests.includes('specialized-operations')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Specialized Operations</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pathwayInterests"
                                            value="other"
                                            checked={formData.pathwayInterests.includes('other')}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700">Other (specify below)</span>
                                    </label>
                                </div>
                                {formData.pathwayInterests.includes('other') && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            name="customPathway"
                                            value={formData.customPathway || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Specify your custom pathway"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Timeline for Access *
                                </label>
                                <select
                                    name="timeline"
                                    required
                                    value={formData.timeline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select timeline</option>
                                    <option value="immediate">Immediate (within 1 month)</option>
                                    <option value="short-term">Short-term (1-3 months)</option>
                                    <option value="medium-term">Medium-term (3-6 months)</option>
                                    <option value="long-term">Long-term (6+ months)</option>
                                    <option value="exploring">Just exploring options</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Data Input Requirements
                                </label>
                                <textarea
                                    name="dataInput"
                                    value={formData.dataInput || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Describe any specific data input requirements or integrations you need"
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                                Additional Information
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tell us more about your partnership goals *
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Describe your business and how you'd like to partner with WingMentor. Mention any specific pathways, programs, or services you're interested in accessing."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            >
                                Submit Request
                            </button>
                            <p className="text-center text-sm text-slate-500 mt-3">
                                Or email us directly at <a href="mailto:enterprise@pilotrecognition.com" className="text-blue-600 hover:underline">enterprise@pilotrecognition.com</a>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EnterpriseAccessPage;
