/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/currency'],
/**
 * @param{record} record
 * @param{search} search
 * @param{currency} currency
 */
function(record, search, currency) {

    /**
     * Function to be executed when field is changed.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        try{
            let currentRec = scriptContext.currentRecord;
            let fieldId = scriptContext.fieldId;
            let languageFee = '';
            if(fieldId === 'custpage_jj_ai_language'){
                let languageId = currentRec.getValue('custpage_jj_ai_language');
                console.log("language ID is : ",languageId);

                //Look the fee record
                let feeRecord = search.lookupFields({
                    type: 'customrecord_jj_fee_details',
                    id: languageId,
                    columns: ['custrecord_jj_language_fee']
                })
                languageFee += feeRecord.custrecord_jj_language_fee;
                console.log("fee is "+ languageFee);
                
                currentRec.setValue({fieldId: 'custpage_jj_ai_fee_amount', value: languageFee});

            };

            if(fieldId === 'custpage_jj_ai_transaction_currency'){
                let currency = currentRec.getValue('custpage_jj_ai_transaction_currency');
                console.log("Currency is : ",currency);

                // function requestSend() {
                //     let urlLink = http.get({
                //         url: 'https://freecurrencyapi.com/'
                //     });
                // }
                // requestSend();

                //Exchange rate
                let baseCurrencyAmount = languageFee;
                let rate = currency.exchangeRate({
                    source: 'IND',
                    target: 'USD',
                });
                let usdAmount = baseCurrencyAmount * rate;
                
                let exchangeRate = currentRec.setValue({fieldId : 'custpage_jj_ai_exchange_rate', value: usdAmount});
                console.log("Exchange rate is : ",exchangeRate);
            };
        }catch(e){
            log.error("Script error ",e.message);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
    
});
