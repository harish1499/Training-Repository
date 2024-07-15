/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/************************************************************************************************************************************
 *********************
 *SuiteScript Training
 *
 * OTP:7403 : External Custom Record Form and Actions
 * 
 * 
 ************************************************************************************************************************************
 **************
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 01-July-2024
 * 
 * Description : This script is for creating the custom record externally without NetSuite access and store the record in the NetSuite
 *               and send Email to the NetSuite Admin and the SalesRep if present.
 *                
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7403 : 01-July-2024 Created the initial built by JJ0333
 * @version 1.1
 * 
 * 
 **************************************************************************************************************************************
 *************/

define(['N/email', 'N/record', 'N/runtime', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (email, record, runtime, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                
                if (scriptContext.request.method === 'GET') {
                    let form = serverWidget.createForm({
                        title: "Customer Custom Form"
                    });
                    let customerName = form.addField({
                        id: 'custpage_jj_customer_name',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Customer Name'
                    });
                    let customerEmail = form.addField({
                        id: 'custpage_jj_customer_email',
                        type: serverWidget.FieldType.EMAIL,
                        label: 'Customer Email'
                    });
                    let subject = form.addField({
                        id: 'custpage_jj_subject',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subject'
                    });
                    let message = form.addField({
                        id: 'custpage_jj_message',
                        type: serverWidget.FieldType.TEXTAREA,
                        label: 'Message'
                    });
                    form.addSubmitButton({
                        label: "Submit"
                    });
                    scriptContext.response.writePage(form);
                }else{
                    // Fetching the entered information
                    let name = scriptContext.request.parameters.custpage_jj_customer_name;
                    let email = scriptContext.request.parameters.custpage_jj_customer_email;
                    let subject = scriptContext.request.parameters.custpage_jj_subject;
                    let message = scriptContext.request.parameters.custpage_jj_message;

                    let recordId = createCustomRecord(name,email,subject,message);
                    log.debug("Record Id is : ",recordId);

                    let adminId = runtime.getCurrentUser().id;
                    log.debug("Admin Id is ",adminId);

                    if(recordId){
                        sendEmailToAdmin(adminId);
                    }

                    //Creating custom record
                    let outputMessage = "The Customer Entered Information : \n";
                    outputMessage += "Customer Name :  " + name + '\n';
                    outputMessage += "Customer Email :  " + email + '\n';
                    outputMessage += "Subject :  " + subject + '\n';
                    outputMessage += "Message :  " + message + '\n';
                    outputMessage += "Internal Id :  " + recordId + '\n';
                    scriptContext.response.write(outputMessage);
                }

                function createCustomRecord(name,email,subject,message){

                    // Create custom record
                    let customRec = record.create({
                        type: 'customrecord_jj_custom_customer_record',
                        isDynamic: true
                    });
                    customRec.setValue({
                        fieldId: 'name',
                        value: name
                    });
                    customRec.setValue({
                        fieldId: 'custrecord_jj_customer_email',
                        value: email
                    });
                    customRec.setValue({
                        fieldId: 'custrecord_jj_customer_subject',
                        value: subject
                    });
                    customRec.setValue({
                        fieldId: 'custrecord_jj_customer_message',
                        value: message
                    });
                    customRec.setValue({
                        fieldId: 'custrecord_jj_customer_reference',
                        value: referalName(email)
                    })
                    let recId = customRec.save();
                    return recId;
                }

                function referalName(email){
                    //Search for email
                    let emailSearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: ['email','is',email],
                        columns: ['internalid','salesrep']
                    });

                    let runSearch = emailSearch.run().getRange({start:0,end:1});
                    if(runSearch && runSearch.length > 0){
                        log.debug("Email is available in customer record : ",email);
                        let customerId = runSearch[0].getValue('internalid');
                        log.debug("Customer Id is: ",customerId);
                        customerSalesRepEmail(customerId);
                        return customerId; 
                    } 
                }

                function sendEmailToAdmin(adminId){
                    email.send({
                        author: 2026,
                        recipients: adminId,
                        subject: "New Custom Record Created",
                        body: "Hello admin new custom record has been created"
                    });
                }

                function customerSalesRepEmail(customerId){
                    let customerRec = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: customerId,
                        columns: ['salesrep']
                    });
                    let salesRepId = customerRec.salesrep[0].value;
                    if(salesRepId){
                        log.debug("Sales Rep is : ",salesRepId);
                        email.send({
                            author: -5,
                            recipients: salesRepId,
                            subject: "Hi Sales rep new custom record has been created",
                            body: "New customer record has been created under your customer email address"
                        });
                    }
                    else{
                        log.debug("Sales rep not present");
                        return '';
                    }
                }                   
            }catch(e){
                log.error("Not worked",e.message);
            }

        }

        return {onRequest}

    });
