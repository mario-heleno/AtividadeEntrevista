CREATE PROC FI_SP_ConsClienteV2
	@CPF VARCHAR(11)
AS
BEGIN
	SELECT NOME, SOBRENOME, NACIONALIDADE, CEP, ESTADO, CIDADE, 
		LOGRADOURO, EMAIL, TELEFONE, ID, CPF FROM CLIENTES WITH(NOLOCK) WHERE CPF = @CPF
END