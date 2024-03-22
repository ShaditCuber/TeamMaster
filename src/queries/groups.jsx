import { use } from "i18next";
import { clienteBack } from "../util/clienteAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



const generateGroups = async (data) => {
    const response = await clienteBack.post(`groups/generateGroups`, data);
    return response.data;
}




export const useGenerateGroups = () => {

    return useMutation(
        {
            mutationFn: (data) => {
                return generateGroups(data);
            }
        }
    );
}