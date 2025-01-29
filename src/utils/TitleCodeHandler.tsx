import { signOut } from "../services/api";

export const TitleCodeHandler = (navigate: any) => {
    const titleCode = localStorage.getItem("titleCode");

    if (titleCode === null) {
        const handleSignOut = async () => {
            try {
                const response = await signOut();
                if (response.status === 200) {
                    navigate("/entrar");
                }
            } catch (error) {
                console.error(error);
            }
        };

        handleSignOut();
    }
};
