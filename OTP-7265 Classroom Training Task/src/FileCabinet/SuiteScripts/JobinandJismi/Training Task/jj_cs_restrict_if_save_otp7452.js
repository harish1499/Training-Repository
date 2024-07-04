/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/************************************************************************************************************************************
 *********************
 *SuiteScript Training
 *
 * OTP:7452 : Restrict Item fulfillment save
 * 
 * 
 ************************************************************************************************************************************
 **************
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 03-July-2024
 * 
 * Description : This script describe that the sales order is linked with any customer deposit transaction, if linked check the
 *               customer deposit transaction total is equal or greater that the sales order total. Only the condition satisfies then 
 *               allow item fulfillment record to be saved.
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7452 : 03-July-2024 Created the initial built by JJ0333
 * 
 * 
 **************************************************************************************************************************************
 *************/

define(['N/record'],
/**
 * @param{record} record
 */
function(record) {

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        try{
            let currentRec = scriptContext.currentRecord;
            let salesOrderId = currentRec.getValue('createdfrom');

            //Load sales order details
            let salesOrderRec = record.load({
                type: record.Type.SALES_ORDER,
                id: salesOrderId
            });

            let total = salesOrderRec.getValue('total');
            log.debug("Sales Ordet Total is :  ",total);

            let customerDepositLineCount = salesOrderRec.getLineCount({
                sublistId: 'links'
            });
            
            //Checks the sales order record links to customer deposit transaction
            if(customerDepositLineCount > 0){
                let customerDepositTransactionId = salesOrderRec.getSublistValue({
                    sublistId: 'links',
                    fieldId: 'id',
                    line: 0
                });
                log.debug("Custmer Deposit Transactions Id is : ",customerDepositTransactionId);

                let customerDepositTransactionTotal = salesOrderRec.getSublistValue({
                    sublistId: 'links',
                    fieldId: 'total',
                    line: 0
                });

                //Checks the customer deposit transaction total is greater or lesser that sales order total
                if(customerDepositTransactionTotal >= total){
                    log.debug("Item Fullfillment Record created successfully");
                    return true;
                }
                else{
                    alert("Customer Deposit Transaction is lesser that sales order total");
                    log.debug("Lesser than sales order total");
                    return false;
                }
            }else{
                alert("Custmer Deposit Transactions is not available ")
                log.debug("Custmer Deposit Transactions is not available");
                return false;
            }
    
            return false;
        }catch(e){
            log.error("Error Detected",e.message);
        }
    }

    return {
        saveRecord: saveRecord
    };
    
});
