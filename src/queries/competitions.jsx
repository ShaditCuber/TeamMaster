import { callWCA } from "../util/clienteAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WCA_BASE_URL } from '../Const/Const';

const fetchCompetitions = async (date) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const params = {
        "managed_by_me": true,
        "start": oneWeekAgo.toISOString(),
        "sort": "start_date"
    }
    return callWCA('competitions?' + new URLSearchParams(params).toString());
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
        queryFn: fetchCompetition,
        keepPreviousData: true,
    });
}