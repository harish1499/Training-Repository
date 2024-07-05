/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/************************************************************************************************************************************
 *********************
 *SuiteScript Training
 *
 * OTP:7472 : Identify Change in Address
 * 
 * 
 ************************************************************************************************************************************
 **************
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 05-July-2024
 * 
 * Description : This script describe that if there is any change happens in existing address or new address is added in the customer
 *               record it automates to check the custom checkbox value as true.
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7472 : 05-July-2024 Created the initial built by JJ0333
 * 
 **************************************************************************************************************************************
 *************/

define(['N/record'],
/**
 * @param{record} record
 */
function(record) {

    function fieldChanged(scriptContext) {
       
        let currentRec = scriptContext.currentRecord;
        let fieldId = scriptContext.fieldId;
        let sublistId = scriptContext.sublistId;

        //If changes happens in existing address or new address added the custom checkbox is checked.
        if(sublistId === 'addressbook' && fieldId === 'addressbookaddress_text'){
            let customCheckBox = currentRec.setValue({
                fieldId: 'custentity_jj_address_changed',
                value: true
            });
            console.log("Line address is changed, Checkbox checked");
        }else{
            let customCheckBox = currentRec.setValue({
                fieldId: 'custentity_jj_address_changed',
                value: false
            });
        }
    }
    
    return {
        fieldChanged: fieldChanged
    };
    
});