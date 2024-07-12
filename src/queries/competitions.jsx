import { callWCA, patchWCA } from "../util/clienteAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchCompetitions = async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const params = {
        "managed_by_me": true,
        "start": oneWeekAgo.toISOString(),
        "sort": "start_date"
    }
    return callWCA('competitions?' + new URLSearchParams(params).toString());
}

const postWcif = async (data, competitionId) => {
    return patchWCA(`competitions/${competitionId}/wcif`, data);
}

const fetchCompetition = async (competitionId) => {
    return callWCA(`competitions/${competitionId}/wcif`);
}

export const useCompetitions = () => {
    return useQuery({
        queryKey: ['competitions'],
        queryFn: fetchCompetitions,
        keepPreviousData: true,
    });
}

export const useCompetition = (competitionId) => {
    return useQuery({
        queryKey: ['competition', competitionId],
        queryFn: () => fetchCompetition(competitionId),
        keepPreviousData: true,
    });
}

export const useSaveWcif = () => {
    return useMutation({
        mutationFn: (data) => {
            return postWcif(data, data.id);
        }
    });
}