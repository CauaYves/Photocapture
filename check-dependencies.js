const { execSync } = require("child_process");
const { existsSync } = require("fs");

try {
    const red = "\x1b[31m";
    const blue = "\x1b[34m";
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const green = "\x1b[32m";

    console.log(" Verificando dependencias...");
    if (!existsSync("./node_modules")) {
        console.error(`
${red}${bold}⚠️  ERRO: Dependências não encontradas!${reset}

${red}Você tentou executar o projeto sem as dependências instaladas. Siga um dos passos abaixo para corrigir:${reset}

${blue}${bold}1.${reset} Execute o comando:
   ${blue}'npm install'${reset}

${blue}${bold}2.${reset} Use a tarefa configurada:
   ${blue}'Instalar'${reset}

${red}Certifique-se de que as dependências estão instaladas antes de tentar novamente.${reset}
        `);

        process.exit(1);
    } else {
        console.log(
            `${green} Dependendencias verificadas, executando o app...${reset}`
        );
    }

    execSync("npm ls react", { stdio: "ignore" });
} catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error.message);
    process.exit(1);
}
