$(document).ready(function() {

	$('#cpf').mask('000.000.000-00', {reverse: true});
	$('#dataNascimento').mask('00/00/0000', {reverse: true});
	
	$("#funcionario").click(function()
	{
		if ( $('#funcionario').prop("checked") )
		{
			$('#select-projeto-row').removeClass("hide")
			dropDown()
		}
		else
		{
			$('#select-projeto-row').addClass("hide")
			var next_id = $("#select-projeto");
			$(next_id).empty();
			$(next_id).material_select();
		}
	});
});

function dropDown()
{
	$.ajax({
		url: "http://localhost:8080/public/getprojetos",
		success: function (obj)
		{
			var next_id = $("#select-projeto");
			$(next_id).empty();
			$(next_id).append($("<option></option>").attr("value", "o").text("Escolha um projeto"));
			$.each(obj, function(key, value) {
				$(next_id).append($("<option></option>").attr("value", value.id).text(value.nome));
			});
			$(next_id).material_select();
		}
	})
}

function save() 
{
	if ($("#membro-form").valid()) 
	{
		$.ajax({
			type : "POST",
			data : $("#membro-form").serializeObject(),
			url : "http://localhost:8080/public/membro",
			success : function(obj) 
			{
				if (obj != null && obj != undefined) 
				{
				    swal({
				    	  title: "Sucesso",
		                  text: obj,
		                  type: "success",
		                  confirmButtonColor: "#DD6B55",
		                  confirmButtonText: "Fechar!",
		                  closeOnConfirm: false
		            },
		            function(isConfirm){
		            	location.reload();
		            });
				} else 
				{
					 swal({
				    	  title: "Erro",
		                  text: obj,
		                  type: "erro",
		                  confirmButtonColor: "#DD6B55",
		                  confirmButtonText: "Fechar!",
		                  closeOnConfirm: false
		            },
		            function(isConfirm){
		            	location.reload();
		            });
				}
				
			}
		})
	}
}

jQuery.validator.addMethod(
		"validDate",
		function(value, element) {
		    return value.match(/(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/(?:19|20\d{2})/);
		},
		"Please enter a valid date in the format DD/MM/YYYY"
		);

$("#membro-form").validate({
	submitHandler: function(form) 
	{
	    save();
	},
	rules : {
		cpf : {
			required : false,
			remote : {
				url : "http://localhost:8080/public/iscpfcnpjvalido",
				type : "POST",
				data : {
					"entrada" : function() {
						return $("#cpf").val()
					}
				},
				dataFilter : function(response)
				{
					var response = jQuery.parseJSON(response);
					currentMessage = response.Message;
					
					if (response) {
						return true;
					}
					return false;
				}
			}
		},
		dataNascimento: {
			validDate: true
	    }
	},
	messages: {
		cpf: "CPF inválido!"
    },
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	}
});