import { use } from "i18next";
import { clienteBack } from "../util/clienteAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



const generateGroups = async (data) => {
    const response = await clienteBack.post(`groups/generateGroups`, data);
    return response.data;
}

const generateScoreSheet = async (data) => {
    const response = await clienteBack.post(`groups/generateScoresheet`, data);
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

export const useGenerateScoreSheet = () => {

    return useMutation(
        {
            mutationFn: (data) => {
                return generateScoreSheet(data);
            }
        }
    );
}