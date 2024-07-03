/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/************************************************************************************************************************************
 *********************
 *SuiteScript Training
 *
 * OTP:7406 : Custom page for display sales order based on status
 * 
 * 
 ************************************************************************************************************************************
 **************
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 02-July-2024
 * 
 * Description : This script describs the process of creating the custom form to display sales orders details, which need to be fulfilled or
                 billed, and the filter applies to display the records.. 
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7406 : 02-July-2024 Created the initial built by JJ0333
 * @version 1.1
 * 
 * 
 **************************************************************************************************************************************
 *************/

define(['N/search', 'N/ui/serverWidget'],

    function(search, serverWidget) {
    
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            try {
                if (scriptContext.request.method === 'GET') {
                    // Creating form
                    let form = serverWidget.createForm({
                        title: "Sales Order Status"
                    });
    
                    // Add filter fields
                    form.addField({
                        id: 'custpage_customer_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'customer',
                        label: "Customer List"
                    });
    
                    form.addField({
                        id: 'custpage_subsidiary_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'subsidiary',
                        label: "Subsidiary List"
                    });
    
                    form.addField({
                        id: 'custpage_department_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'department',
                        label: "Department List"
                    });
    
                    form.addField({
                        id: 'custpage_class_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'classification',
                        label: "Class List"
                    });
    
                    form.addField({
                        id: 'custpage_status_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'salesorderstatus',
                        label: "Status"
                    });
    
                    // Add sublist to display details
                    let soSublist = form.addSublist({
                        id: 'custpage_sublist',
                        type: serverWidget.SublistType.LIST,
                        label: "Sales Order Details"
                    });
    
                    // Adding sublist fields
                    soSublist.addField({
                        id: 'custpage_internal_id',
                        type: serverWidget.FieldType.TEXT,
                        label: "Internal Id"
                    });
    
                    soSublist.addField({
                        id: 'custpage_document_number',
                        type: serverWidget.FieldType.TEXT,
                        label: "Document Number"
                    });
    
                    soSublist.addField({
                        id: 'custpage_date',
                        type: serverWidget.FieldType.DATE,
                        label: "Date"
                    });
    
                    soSublist.addField({
                        id: 'custpage_status',
                        type: serverWidget.FieldType.TEXT,
                        label: "Status"
                    });
    
                    soSublist.addField({
                        id: 'custpage_customer_name',
                        type: serverWidget.FieldType.TEXT,
                        label: "Customer Name"
                    });
    
                    soSublist.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.TEXT,
                        label: "Subsidiary"
                    });
    
                    soSublist.addField({
                        id: 'custpage_department',
                        type: serverWidget.FieldType.TEXT,
                        label: "Department"
                    });
    
                    soSublist.addField({
                        id: 'custpage_class',
                        type: serverWidget.FieldType.TEXT,
                        label: "Class"
                    });
    
                    soSublist.addField({
                        id: 'custpage_line_number',
                        type: serverWidget.FieldType.TEXT,
                        label: "Line Number"
                    });
    
                    soSublist.addField({
                        id: 'custpage_sub_total',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Sub Total"
                    });
    
                    soSublist.addField({
                        id: 'custpage_tax',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Tax"
                    });
    
                    soSublist.addField({
                        id: 'custpage_total',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Total"
                    });
    
                    form.addSubmitButton({
                        label: "Search"
                    });
    
                    scriptContext.response.writePage(form);
    
                } else if (scriptContext.request.method === 'POST') {
                    // Retrieve filter values
                    let customerId = scriptContext.request.parameters.custpage_customer_list;
                    log.debug("Customer Name is : ",customerId);
                    let subsidiaryId = scriptContext.request.parameters.custpage_subsidiary_list;
                    let departmentId = scriptContext.request.parameters.custpage_department_list;
                    let classId = scriptContext.request.parameters.custpage_class_list;
                    let statusId = scriptContext.request.parameters.custpage_status_list;

                    //Create form
                    let displayForm = serverWidget.createForm({
                        title: "Sales Order Result"
                    });

                    // Add filter fields
                    let entityIdField = displayForm.addField({
                        id: 'custpage_customer_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'customer',
                        label: "Customer List"
                    });
                    entityIdField.defaultValue = customerId || '';

                    let subsidiaryIdField = displayForm.addField({
                        id: 'custpage_subsidiary_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'subsidiary',
                        label: "Subsidiary List"
                    });
                    subsidiaryIdField.defaultValue = subsidiaryId || '';

                    displayForm.addField({
                        id: 'custpage_department_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'department',
                        label: "Department List"
                    });

                    displayForm.addField({
                        id: 'custpage_class_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'classification',
                        label: "Class List"
                    });

                    displayForm.addField({
                        id: 'custpage_status_list',
                        type: serverWidget.FieldType.SELECT,
                        source: 'salesorderstatus',
                        label: "Status"
                    });

                    // Add sublist to display details
                    let soSublist = displayForm.addSublist({
                        id: 'custpage_sublist',
                        type: serverWidget.SublistType.LIST,
                        label: "Sales Order Details"
                    });

                    // Adding sublist fields
                    soSublist.addField({
                        id: 'custpage_internal_id',
                        type: serverWidget.FieldType.TEXT,
                        label: "Internal Id"
                    });

                    soSublist.addField({
                        id: 'custpage_document_number',
                        type: serverWidget.FieldType.TEXT,
                        label: "Document Number"
                    });

                    soSublist.addField({
                        id: 'custpage_date',
                        type: serverWidget.FieldType.DATE,
                        label: "Date"
                    });

                    soSublist.addField({
                        id: 'custpage_status',
                        type: serverWidget.FieldType.TEXT,
                        label: "Status"
                    });

                    soSublist.addField({
                        id: 'custpage_customer_name',
                        type: serverWidget.FieldType.TEXT,
                        label: "Customer Name"
                    });

                    soSublist.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.TEXT,
                        label: "Subsidiary"
                    });

                    soSublist.addField({
                        id: 'custpage_department',
                        type: serverWidget.FieldType.TEXT,
                        label: "Department"
                    });

                    soSublist.addField({
                        id: 'custpage_class',
                        type: serverWidget.FieldType.TEXT,
                        label: "Class"
                    });

                    soSublist.addField({
                        id: 'custpage_line_number',
                        type: serverWidget.FieldType.TEXT,
                        label: "Line Number"
                    });

                    soSublist.addField({
                        id: 'custpage_sub_total',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Sub Total"
                    });

                    soSublist.addField({
                        id: 'custpage_tax',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Tax"
                    });

                    soSublist.addField({
                        id: 'custpage_total',
                        type: serverWidget.FieldType.CURRENCY,
                        label: "Total"
                    });
    
                    // Create filter 
                    let filters = [["status","anyof","SalesOrd:E"]];
     
                    if (customerId) {
                        filters.push('AND', ['entity', 'is', customerId]);
                    }

                    if (subsidiaryId) {
                        filters.push('AND', ['subsidiary', 'is', subsidiaryId]);
                    }
                    
                    if (departmentId) {
                        filters.push(search.createFilter({
                            name: 'department',
                            operator: search.Operator.ANYOF,
                            values: departmentId
                        }));
                    }
                    if (classId) {
                        filters.push(search.createFilter({
                            name: 'class',
                            operator: search.Operator.ANYOF,
                            values: classId
                        }));
                    }
                    if (statusId) {
                        filters.push(search.createFilter({
                            name: 'status',
                            operator: search.Operator.ANYOF,
                            values: statusId
                        }));
                    }
    
                    // Create search columns
                    let columns = [
                        search.createColumn({ name: 'internalid', label: 'Internal Id' }),
                        search.createColumn({ name: 'tranid', label: 'Document Number' }),
                        search.createColumn({ name: 'trandate', label: 'Date' }),
                        search.createColumn({ name: 'statusref', label: 'Status' }),
                        search.createColumn({ name: 'entity', label: 'Customer Name' }),
                        search.createColumn({ name: 'subsidiary', label: 'Subsidiary' }),
                        search.createColumn({ name: 'department', label: 'Department' }),
                        search.createColumn({ name: 'class', label: 'Class' }),
                        search.createColumn({ name: 'line', label: 'Line Number' }),
                        //search.createColumn({ name: 'subtotal', label: 'Sub Total' }),
                        search.createColumn({ name: 'taxtotal', label: 'Tax' }),
                        search.createColumn({ name: 'total', label: 'Total' })
                    ];
    
                    // Create search
                    let salesOrderSearch = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: filters,
                        columns: columns
                    });
    
                    let searchResults = salesOrderSearch.run().getRange({ start: 0, end: 3 }); // Limiting to 100 results for example
    
                    // Add search results to the sublist
                    for (let i = 0; i < searchResults.length; i++) {
                        soSublist.setSublistValue({
                            id: 'custpage_internal_id',
                            line: i,
                            value: searchResults[i].getValue({ name: 'internalid' })
                        });
    
                        soSublist.setSublistValue({
                            id: 'custpage_document_number',
                            line: i,
                            value: searchResults[i].getValue({ name: 'tranid' })
                        });
    
                        soSublist.setSublistValue({
                            id: 'custpage_date',
                            line: i,
                            value: searchResults[i].getValue({ name: 'trandate' })
                        });
    
                        soSublist.setSublistValue({
                            id: 'custpage_status',
                            line: i,
                            value: searchResults[i].getText({ name: 'statusref' })
                        });
    
                        soSublist.setSublistValue({
                            id: 'custpage_customer_name',
                            line: i,
                            value: searchResults[i].getText({ name: 'entity' })
                        });
    
                        soSublist.setSublistValue({
                            id: 'custpage_subsidiary',
                            line: i,
                            value: searchResults[i].getText({ name: 'subsidiary' })
                        });
    
                        let department = searchResults[i].getText({ name: 'department' });
                        soSublist.setSublistValue({
                            id: 'custpage_department',
                            line: i,
                            value: department?department:"Not Present"
                        });
                        let classs = searchResults[i].getText({ name: 'class' });
                        soSublist.setSublistValue({
                            id: 'custpage_class',
                            line: i,
                            value: classs?classs:"Not Present"
                        });
    
                    }
                    scriptContext.response.writePage(displayForm);
                    
                }
            }catch(e){
                log.error("Form error",e.message);
            }

        }

        return {onRequest}

    });

    