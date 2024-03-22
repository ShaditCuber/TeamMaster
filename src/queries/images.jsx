import { clienteBack } from "../util/clienteAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



const avatarZip = async (data) => {
    const response = await clienteBack.post(`images`, data);
    return response.data;
}




export const useAvatarZip = () => {

    return useMutation(
        {
            mutationFn: (data) => {
                return avatarZip(data);
            }
        }
    );
}