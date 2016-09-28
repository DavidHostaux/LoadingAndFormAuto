$(function()
{
    /* *********
        LOADING
       *********
    */


    showFilterWaiting_lafa = function()
    {

    };

    hideFilterWaitingError_lafa = function(txt)
    {

    };

    hideFilterWaintingSuccess_lafa = function(txt)
    {

    };



    /* ***********
        FORM AUTO
       ***********
    */

    /*  REQUIRES :

    */
    doAjax_lafa = function($form)
    {
        if(checkAttributeForm_lafa($form) == true)
        {
            var confirm = true;
            if(typeof($form.attr('data-confirm')) != "undefined")
            {
                if(!confirm($form.attr('data-confirm')))
                {
                    confirm = false;
                }
            }
            
            if(confirm == true)
            {
                var valueForm = $form.serializeArray();
                var contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                var processData = true;
                if(typeof($form.attr('enctype')) != "undefined" && $form.attr('enctype') == "multipart/form-data")
                {
                    var form = document.getElementById($form.attr('id'));
                    valueForm = new FormData(form);
                    contentType = false;
                    processData = false;
                }

                // Check if CKEDITOR Instances
                if (typeof (CKEDITOR) != "undefined")
                {
                    for (var key in CKEDITOR.instances)
                    {
                        if(typeof($this.attr('enctype')) != "undefined" && $this.attr('enctype') == "multipart/form-data")
                        {
                            valueForm.append(key, CKEDITOR.instances[key].getData());
                        }
                        else
                        {
                            $.each(valueForm, function ()
                            {
                                console.log(this.name);
                                if (this.name == key)
                                {
                                    this.value = CKEDITOR.instances[key].getData();
                                }
                            });
                        }
                    }
                }

                showFilterWaiting_lafa();
                $.ajax({
                    type: $form.attr("method"),
                    url: $this.attr("action"),
                    data: valueForm,
                    dataType: "json",
                    processData: processData,
                    contentType: contentType,
                    success: function(data)
                    {
                        var txt_return = "";
                        if(typeof(data['txt_return']) != "undefined")
                        {
                            txt_return = data['txt_return'];
                        }

                        if (data["result"] == "true")
                        {
                            eval(data["doaction"]);
                            hideFiltreWaiting_success(txt_return);
                        }
                        else
                        {
                            if (typeof(data["tbl_form_error"]) != "undefined") {
                                $.each(data["tbl_form_error"], function ()
                                {
                                    // $("#" + this.field).append("<span class='error' data-error='field'>" + this.error + "</span>");
                                    $('[name="'+this.field+'"]').attr("data-content", this.error)
                                            .addClass("fieldRed");
                                });
                            }
                            if (typeof(data["tbl_form_error_select"]) != "undefined") {
                                $.each(data["tbl_form_error_select"], function ()
                                {
                                    $("#" + this.field).parent(".SumoSelect").addClass("rond_border");
                                    $("#" + this.field).parent(".SumoSelect").addClass("fieldRed");
                                });
                            }
                            var txt_waiting = "";
                            if (data["error_wainting"])
                            {
                                txt_waiting = data["error_wainting"];
                            }
                            hideFiltreWaiting_error(txt_waiting); //Fin de chargement.  txt_waiting qui contient message d erreur
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        hideFilterWaitingError_lafa($form.data('txterror'));
                        console.error(textStatus + errorThrown);
                    }
                });
            }
        }
    };

    /*  REQUIRES :  options is an array
                    $this is the reference of the form. Ex: $('form#form')
                    attr is the index in the array options. Ex: options[attr]
        MODIFIES :  if options[attr] is undefined and $this.attr(attr) is not undefined, set options[attr] = $this.attr(attr)
        EFFECTS  :  return options
    */
    function checkOptionsForm_lafa(options, $this, attr)
    {
        if(typeof(options[attr]) == "undefined")
        {
            if(typeof($this.attr(attr)) != "undefined")
            {
                options[attr] = $this.attr(attr);
            }
        }

        return options;
    };

    /*  REQUIRES :  $form is the reference of the form
        MODIFIES :  /
        EFFECTS  :  Check if the form has correct mandatory attribute.
                        return true if it's correct
                        return false if it's not correct and warn the incorrect attribute
    */
    function checkAttributeForm_lafa($form)
    {
        var method = $form.attr('method');
        var data_send = $form.attr('data-send');
        var data_type = $form.attr('data-type');
        if(typeof($form.attr('action')) != "undefined"
        && typeof(method) != "undefined"
        && typeof(data_send) != "undefined"
        && typeof(data_type) != "undefined"
        && typeof($form.attr('data-txterror')) != "undefined")
        {
            var error = false;
            if(method.toUpperCase() != "POST"
            && method.toUpperCase() != "GET")
            {
                console.warn("the form attr 'method' is not 'POST' OR 'GET'");
                error = true;
            }
            if(data_send != "auto"
            && data_send != "button")
            {
                console.warn("the form attr 'data-send' is not 'auto' OR 'button'");
                error = true;
            }
            if(data_type != "json"
            && data_type != "xml")
            {
                console.warn("the form attr 'data-type' is not 'json' OR 'xml'");
                error = true;
            }

            if(error == false)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else {
            console.warn("The mandatory attribute is not set correctly on the 'form'");
            return false;
        }
    }

    /*  REQUIRES :   options is an array with index
                        - id :  the ID of the form
                        - action    :   contain the URL that receipt the form
                        - method    :   method use to send the form. Values available are
                            => POST/post
                            => GET/get
                        - data-send :   contain if the form is send automaticaly or with a button. Values available are
                            => auto     : The form is send as soon as the input change
                            => button   : The form is send with a button
                        - data-type  :   contain the type of the send/reponse. Values available are
                            => json
                            => xml
                        - data-txterror     :   the text show when the ajax form is in error
                        - OPTIONAL enctype  :   send the form with files. If there is no file, don't write this index. Value available is
                            => multipart/form-data
                        - OPTIONAL data-txtconfirm   :   a confirm javascript popup that is show before the send of the form. If the user don't confirm, the form is not send. Value is the texte of the popup
        MODIFIES :    check if options index is defined
        EFFECTS  :    [...]
    */
    $.fn.lafa = function(options)
    {
        if(this.is('form'))
        {
            if(typeof(options) == "undefined")
            {
                options = new Array();
            }

            // Check options index
            options = checkOptionsForm_lafa(options, this, "id");
            options = checkOptionsForm_lafa(options, this, "action");
            options = checkOptionsForm_lafa(options, this, "method");
            options = checkOptionsForm_lafa(options, this, "data-send");
            options = checkOptionsForm_lafa(options, this, "data-type");
            options = checkOptionsForm_lafa(options, this, "data-txterror");
            options = checkOptionsForm_lafa(options, this, "enctype");
            options = checkOptionsForm_lafa(options, this, "data-txtconfirm");


            // Set options in the form attr
            $.each(options, function(index, value)
            {
                this.attr(index, value);
            });

            if(checkAttributeForm_lafa(this) == true)
            {
                if(options["data-send"] == "auto")
                {
                    this.unbind('submit')
                    .submit(function()
                    {
                        return false;
                    });

                    this.children('input, select, textarea')
                    .unbind('change')
                    .change({
                        doAjax_lafa($(this).closest('form[data-send="auto"]'));
                        return false;
                    });
                }
                else {
                    this.unbind('submit')
                    .submit(function()
                    {
                        doAjax_lafa($(this));
                        return false;
                    });
                }
            }
        }
        else {
            console.warn("The object passed is not a 'form'");
        }

        return this;
    };

    /* REQUIRES :   OPTIONAL exist in the page form[data-send]
       MODIFIES :   set lafa() on form[data-send]
       EFFECTS  :   /
    */
    if($('form[data-send]').length)
    {
        $('form[data-send]').lafa();
    }
});
