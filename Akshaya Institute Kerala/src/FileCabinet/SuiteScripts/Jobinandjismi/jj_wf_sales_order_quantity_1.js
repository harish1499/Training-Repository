/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/runtime'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 */
    (record, runtime) => {
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
            let newRec = scriptContext.newRecord;
            let salesOrderId = newRec.id;
            log.debug("Record Internal Id is : ",newRec);
            let flag = 0;

            let user = runtime.getCurrentUser();
            let userRole = user.role;
            log.debug("User role is : ",userRole);

            if(userRole === administrator || userRole === 3){
                flag=1;
                return flag;
            };

            let status = search.lookUpFileds({
                type: "salesorder",
                id: salesOrderId,
                columns: ['status']
            });

            if(status === 'pending fulfillment'){
                flag = 1;
                return flag;
            };

            let quantitySearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: ['internalid','anyof',salesOrderId],
                columns: [
                    search.createColumn({
                        name: 'quantity',
                        summary: "SUM",
                        label: 'Sum Quantity'
                    })
                ]
            });

            let totalQuantity = 0;
            quantitySearch.run().each(function(result){
                totalQuantity += result.getValue({name: 'quantity', summary: 'SUM', label: 'Sum Quantity'});
                return false;
            });
            log.debug("Total quantity is : ",totalQuantity);
            return totalQuantity;
        }

        return {onAction};
    });
