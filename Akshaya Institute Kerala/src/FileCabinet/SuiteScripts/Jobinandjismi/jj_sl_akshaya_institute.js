/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){

                    //Creating the form
                    let form = serverWidget.createForm({
                        title: "Akshaya Institute Fee Queries Form"
                    });

                    form.clientScriptFileId =  8436;

                    form.addField({
                        id: 'custpage_jj_ai_name',
                        type: serverWidget.FieldType.TEXT,
                        label: "Name: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_country',
                        type: serverWidget.FieldType.TEXT,
                        label: "Country: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_age',
                        type: serverWidget.FieldType.INTEGER,
                        label: "Age: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_phone',
                        type: serverWidget.FieldType.PHONE,
                        label: "Phone: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_email',
                        type: serverWidget.FieldType.EMAIL,
                        label: "Email Address: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_language',
                        type: serverWidget.FieldType.SELECT,
                        label: "Language: ",
                        source: 'customrecord_jj_fee_details'
                    });

                    form.addField({
                        id: 'custpage_jj_ai_base_currency',
                        type: serverWidget.FieldType.SELECT,
                        label: "Base Currency: ",
                        source: 'currency'
                    }).defaultValue = 9;
                    
                    form.addField({
                        id: 'custpage_jj_ai_transaction_currency',
                        type: serverWidget.FieldType.SELECT,
                        label: "Transaction Currency: ",
                        source: 'currency'
                    });

                    form.addField({
                        id: 'custpage_jj_ai_fee_amount',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Fee Amount: "
                    });

                    form.addField({
                        id: 'custpage_jj_ai_exchange_rate',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Exchange Rate: "
                    });

                    form.addSubmitButton({
                        title: "Save"
                    });

                    //Display the form
                    scriptContext.response.writePage(form);
                }

                else{                                                //POST method
                    let name = scriptContext.request.parameters.custpage_jj_ai_name;
                    let country = scriptContext.request.parameters.custpage_jj_ai_country;
                    let age = scriptContext.request.parameters.custpage_jj_ai_age;
                    let phoneNumber = scriptContext.request.parameters.custpage_jj_ai_phone;
                    let emailAddress = scriptContext.request.parameters.custpage_jj_ai_email;
                    let language = scriptContext.request.parameters.custpage_jj_ai_language;
                    let baseCurrency = scriptContext.request.parameters.custpage_jj_ai_base_currency;
                    let transactionCurrency = scriptContext.request.parameters.custpage_jj_ai_transaction_currency;
                    let feeAmount = scriptContext.request.parameters.custpage_jj_ai_fee_amount;
                    let exchangeRate = scriptContext.request.parameters.custpage_jj_ai_exchange_rate;

                    //Creating the custom record with the gathered information
                    let leadRec = record.create({
                        type: 'customrecord_jj_akshaya_institute_fee',
                        isDynamic: true
                    });

                    //Setting the field value
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_name', value: name });
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_country', value: country});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_age', value: age});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_phone_number', value: phoneNumber});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_email', value: emailAddress});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_language', value: language});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_base_currency', value: baseCurrency});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_transaction_currency', value: transactionCurrency});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_fee_amount', value: feeAmount});
                    leadRec.setValue({ fieldId: 'custrecord_jj_ai_exchange_rate', value: exchangeRate});

                    let recId = leadRec.save();
                    log.debug("New Lead Record saved",recId);

                    //Display the information
                    let outputMessage = "The Details you entered : \n";
                    outputMessage += "Name: "+name+'\n';
                    outputMessage += "Country: "+country+'\n';
                    outputMessage += "Age: "+age+'\n';
                    outputMessage += "Phone Number: "+phoneNumber+'\n';
                    outputMessage += "Email: "+emailAddress+'\n';
                    outputMessage += "Language: "+language+'\n';
                    outputMessage += "Base Currency: "+baseCurrency+'\n';
                    outputMessage += "Transaction Currency: "+transactionCurrency+'\n';
                    outputMessage += "Fee Amount: "+feeAmount+'\n';
                    outputMessage += "Exchange Rate: "+exchangeRate+'\n';

                    scriptContext.response.write(outputMessage);
                }
            }catch(e){
                log.error("Form not created",e.message);
            }
        }

        return {onRequest}

    });
