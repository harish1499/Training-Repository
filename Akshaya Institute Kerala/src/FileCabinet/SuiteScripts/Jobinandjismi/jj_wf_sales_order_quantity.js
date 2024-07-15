/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/currentRecord', 'N/record', 'N/search', 'N/runtime'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 * @param{render} runtime
 */
    (currentRecord, record, search, runtime) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            try{
                let newRec = scriptContext.newRecord.id;
                log.debug("Internal Id is : ",newRec);

                let salesorderSearch = search.create({
                    type: "salesorder",
                    filters:
                    [
                       ['internalid','anyof',newRec]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "quantity",
                          summary: "SUM",
                          label: "Quantity"
                       })
                    ]
                 });
    
                  //Running search
                  let sum = 0;
                  let searchRun = salesorderSearch.run().each(function(result){
                    sum += result.getValue({name : 'quantity', summary :'SUM'});
                    return false;
                });
                log.debug("Sum is ",sum);
                return sum;

            }catch(e){
                log.error("Error found",e.message);
            }
            
        }

        return {onAction};
    });