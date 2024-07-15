/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/currency', 'N/https'],
/**
 * @param{record} record
 * @param{search} search
 * @param{currency} currency
 * @param{http} https
 */
function(record, search, currency, https) {

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

            let internalId = currentRec.id;
            console.log("Internal Id : ",internalId);

            if(fieldId === 'custpage_jj_ai_language'){
                let languageId = currentRec.getValue('custpage_jj_ai_language');
                console.log("language ID is : ",languageId);

                //Look the fee record
                let feeRecord = search.lookupFields({
                    type: 'customrecord_jj_fee_details',
                    id: languageId,
                    columns: ['custrecord_jj_language_fee']
                })
                let languageFee = feeRecord.custrecord_jj_language_fee;
                console.log("fee is ", languageFee);
                currentRec.setValue({fieldId: 'custpage_jj_ai_fee_amount', value: languageFee});
            };

            if(fieldId === 'custpage_jj_ai_transaction_currency'){
                let transactionCurrency = currentRec.getText('custpage_jj_ai_transaction_currency');
                console.log("Currency is : ",transactionCurrency);

                let langueeFeeValue = currentRec.getValue('custpage_jj_ai_fee_amount');
                console.log("Language fee is : ",langueeFeeValue);

                let exchangeRateValue = exchangeRate(transactionCurrency);
                console.log("Exchange value is :",exchangeRateValue);

                let payable = langueeFeeValue * exchangeRateValue;
                console.log("Final payable is : ",payable)

                let finalExchangeRate = currentRec.setValue({
                    fieldId: 'custpage_jj_ai_exchange_rate',
                    value: payable
                });

                //Fetching exchange rate from API endpoint
                function exchangeRate(transactionCurrency){
                    let headerObj = {
                        'Content-Type': 'application/json'
                    };
                    
                    let response = https.get({
                        url: 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_5jMszTbsSSfJRUMCzOlKbeE6isIYrMSDT9ri8f2F&currencies=EUR%2CUSD&base_currency=INR',
                        header: headerObj
                    });
                    console.log("Response is :",response);

                    let jsonValues = JSON.parse(response.body);
                    let exchangeRate = jsonValues.data[transactionCurrency];

                    // console.log("Exchange rate is : ",exchangeRate);
                    return exchangeRate;
                }
            };
        }catch(e){
            log.error("Script error ",e.message);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
    
});
