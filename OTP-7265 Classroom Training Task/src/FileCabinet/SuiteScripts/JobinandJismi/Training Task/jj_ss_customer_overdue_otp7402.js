/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
/************************************************************************************************************************************
 *********************
 *SuiteScript Training
 *
 * OTP:7402 : Monthly Overdue Remainder For Customer
 * 
 * 
 ************************************************************************************************************************************
 **************
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 27-July-2024
 * 
 * Description : This script is for sending a remainder E-mail notification to the customers who are having the invoice overdue
 *               till previous month with the CSV File attachment containing the customer information and the overdue invoice details. 
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7402 : 27-July-2024 Created the initial built by JJ0333
 * @version 1.1
 * 
 * 
 **************************************************************************************************************************************
 *************/

 define(['N/email', 'N/file', 'N/search', 'N/log'],
    (email, file, search, log) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
                // Create search for overdue invoice
                let invoiceSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [
                        ["duedate", "onorbefore", "startoflastmonth"], 
                        "AND",
                        ["mainline", "is", "T"], 
                        "AND",
                        ["status", "anyof", "CustInvc:A"] 
                    ],
                    columns: [
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "email", join: "customer" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({ name: "daysoverdue", label: "Days Overdue" }),
                        search.createColumn({ name: "salesrep", join: "customer" })
                    ]
                });

                // Creating object to store 
                let customerInvoices = {};

                invoiceSearch.run().each(function(result) {
                    let customerId = result.getValue('entity');
                    let customerEmail = result.getValue({ name: "email", join: "customer" });
                    let customerName = result.getText('entity');
                    let documentNumber = result.getValue('tranid');
                    let amount = result.getValue('amount');
                    let daysOverdue = result.getValue('daysoverdue');
                    let salesRep = result.getValue({ name: 'salesrep', join: 'customer' });

                    // Initialize customer data if not already present
                    if (!customerInvoices[customerId]) {
                        customerInvoices[customerId] = {
                            name: customerName,
                            email: customerEmail,
                            salesRep: salesRep,
                            invoices: []
                        };
                    }

                    // Adding invoice details
                    customerInvoices[customerId].invoices.push({
                        documentNumber: documentNumber,
                        amount: amount,
                        daysOverdue: daysOverdue
                    });

                    return true;
                });

                // For each customer to send email with CSV file
                for (let customerId in customerInvoices) {
                    let customer = customerInvoices[customerId];
                    let csvContent = 'Customer Name,Customer Email,Document Number,Amount,Days Overdue\n';

                    customer.invoices.forEach(function(res) {
                        csvContent += customer.name + ',' + customer.email + ',' + res.documentNumber + ',' + res.amount + ',' + res.daysOverdue + '\n';
                    });

                    // Create CSV file
                    let csvFileName = customer.name + '_OverDue_invoices.csv';
                    let csvFile = file.create({
                        name: csvFileName,
                        contents: csvContent,
                        folder: 613,
                        fileType: file.Type.CSV
                    });
                    csvFile.save();

                    // Sending Email
                    let subject = "Overdue Invoice Details";
                    let body = "Hi Customer this email contains your overdue invoice details ";

                    //Saved search for getting the admin Id
                    let adminSearch = search.create({
                        type: search.Type.EMPLOYEE,
                        filters:
                        [
                        ["isinactive","is","F"], 
                        "AND", 
                        ["role","anyof","3"] //NetSuite Administrator role internal Id
                        ],
                        columns:
                        [
                        search.createColumn({name: "internalid", label: "Internal ID"})
                        ]
                    });
                    let adminId = '';
                    adminSearch.run().each(function(result){
                        adminId += result.getValue('internalid');
                        //return true;
                    });

                    //Sending Email
                    let customerSalesRep = customer.salesRep;
                    let senderId = customerSalesRep ? customerSalesRep : adminId;
                    if(customer.email){
                        email.send({
                            author: senderId,
                            recipients: customerId,
                            subject: subject,
                            body: body,
                            attachments: [csvFile]
                        });
                        log.debug("Email sent successfully to " + customer.name, "Email ID: " + customer.email);
                    }
                }

            } catch (e) {
                log.error("Error sending overdue invoice emails", e.message);
            }
        };

        return { execute };

    });
