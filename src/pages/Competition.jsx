import React, { useEffect } from "react";
import { useCompetition, useSaveWcif } from "../queries/competitions";
import { useLocation, Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { useTranslation } from "react-i18next";
import { useGenerateGroups } from "../queries/groups";
import PersonTable from "../components/PersonTable/PersonTable";
import { toast } from "sonner";

function Competion() {
  const { t } = useTranslation("global");

  const [wcif, setWcif] = React.useState([]);
  const [countPersons, setCountPersons] = React.useState(0);
  const [events, setEvents] = React.useState([]);
  const [competitorsByEvent, setCompetitorsByEvent] = React.useState({});
  const [groupsByEvent, setGroupsByEvent] = React.useState([]);
  const [averageByEvent, setAverageByEvent] = React.useState([]);
  const [loadingGroups, setLoadingGroups] = React.useState(false);
  const mutationGenerateGroups = useGenerateGroups();
  const [groupingOption, setGroupingOption] = React.useState("random");
  const [showPersonTable, setShowPersonTable] = React.useState(false);


  const mutationSaveWcif = useSaveWcif();

  let competition_id;

  const location = useLocation();
  try {
    competition_id = location.state.competition_id;
  } catch (error) {
    window.location = "/competitions";
  }
  const { data, isLoading } = useCompetition(competition_id);

  useEffect(() => {
    if (!isLoading && data) {
      const eventIds = data.events.map((event) => event.id);
      setEvents(eventIds);

      // Filtrar los competidores que estan aceptados y que su registration no sea null
      const persons = data.persons.filter(
        (person) => person.registration && person.registration.status === "accepted"
      );

      setCountPersons(persons.length);
      // Contar la cantidad de competidores por evento
      const competitorsCountByEvent = {};
      persons.forEach((competitor) => {
        competitor.registration.eventIds.forEach((eventId) => {
          competitorsCountByEvent[eventId] =
            (competitorsCountByEvent[eventId] || 0) + 1;
        });
      });
      setCompetitorsByEvent(competitorsCountByEvent);

      // Inicializar la cantidad de grupos por evento
      const groupsByEvent = {};
      eventIds.forEach((eventId) => {
        groupsByEvent[eventId] = 2;
      });

      setGroupsByEvent(groupsByEvent);
    }
  }, [isLoading, data]);

  useEffect(() => {
    const updatedAverageByEvent = {};
    events.forEach((eventId) => {
      const competitorsCount = competitorsByEvent[eventId] || 0;
      const groupsCount = groupsByEvent[eventId] || 2;
      updatedAverageByEvent[eventId] = Math.round(
        competitorsCount / groupsCount
      );
    });
    setAverageByEvent(updatedAverageByEvent);
  }, [competitorsByEvent, groupsByEvent]);

  const handleGroupsChange = (eventId, e) => {
    setShowPersonTable(false);
    e.preventDefault();
    const value = parseInt(e.target.value, 10);
    setGroupsByEvent({
      ...groupsByEvent,
      [eventId]: value,
    });

    // Recalcular el promedio solo para el evento específico que está cambiando
    const updatedAverageByEvent = {
      ...averageByEvent,
      [eventId]: Math.round(competitorsByEvent[eventId] / value),
    };

    setAverageByEvent(updatedAverageByEvent);
  };

  const returnToCompetitions = () => {
    window.location = "/competitions";
  };

  const generateGroup = async () => {
    setLoadingGroups(true);
    console.log(groupsByEvent);
    console.log(groupingOption);
    groupsByEvent.criteria = groupingOption;
    const requestData = { wcif: data, data: groupsByEvent };
    const data_groups = await mutationGenerateGroups.mutateAsync(requestData);
    setWcif(data_groups);
    if (data_groups) {
      setLoadingGroups(false);
      setShowPersonTable(true);
    }
  };

  const copyEmails = (accepted = true) => {
    const emails = [];
    data.persons.forEach((person) => {
      if (person.registration) {
        if (accepted) {
          if (person.registration.status === "accepted") {
            emails.push(person.email);
          }
        } else {
          if (person.registration.status !== "accepted") {
            emails.push(person.email);
          }
        }
      }
    });

    navigator.clipboard.writeText(emails.join(", ")).then(function () {
      toast.success(t("copy-emails"), { duration: 1500 });
    });
  };

  const saveWcif = () => {

    // const keysToRemove = ['222','333', '444', '555', '666', '777', 'clock', 'minx', 'sq1', 'pyram'];

    // // Recorre cada persona en el objeto wcif y elimina las claves específicas
    // wcif.persons.forEach(person => {
    //   keysToRemove.forEach(key => {
    //     delete person[key];
    //   });
    // });

    // console.log(wcif)

    const response = mutationSaveWcif.mutate(wcif);



    if (response) {
      console.log('xd')
    }
  };


  if (isLoading || !data || loadingGroups) {
    return <Loader />;
  }

  return (
    <div className="animate-fade-in animate-delay-500 animate-duration-slow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mt-4">
          {data ? data.name : "Loading..."}
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
          onClick={() => returnToCompetitions()}
        >
          {t("back")}
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-md text-gray-500 mb-2 w-full">{t("events")}</h2>
          <p className="text-3xl font-bold text-blue-500 animate-fade-in-right animate-delay-500 animate-duration-slow">{events.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-md text-gray-500 mb-2 w-full">
            {t("competitors")}
          </h2>
          <p className="text-3xl font-bold text-blue-500 animate-fade-in-left animate-delay-500 animate-duration-slow">{countPersons}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded">
        <table className="table-auto min-w-full border-collapse border ">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">{t("categories")}</th>
              {events.map((eventId) => (
                <th key={`${eventId}_event`} className="px-4 py-2 border">
                  {eventId}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold border">
                {t("competitors")}
              </td>
              {events.map((eventId) => (
                <td key={eventId} className="px-4 py-2 border">
                  {competitorsByEvent[eventId] || 0}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-4 py-2 font-semibold border">
                {t("groups-per-round")}
              </td>
              {events.map((eventId) => (
                <td key={eventId} className="px-4 py-2 border">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-gray-500"
                    value={groupsByEvent[eventId]}
                    min={1}
                    onChange={(e) => handleGroupsChange(eventId, e)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-4 py-2 font-semibold border">
                {t("competitors-average")}
              </td>
              {events.map((eventId) => (
                <td key={eventId} className="px-4 py-2 border">
                  {averageByEvent[eventId] || 0}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="lg:flex grid lg:justify-between gap-4 w-full">
        {countPersons > 0 && <><select
          className="w-full px-4 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring h-10"
          name="groupingOption"
          id="groupingOption"
          onChange={(e) => setGroupingOption(e.target.value)}
        >
          <option value="random">{t("random")}</option>
          <option value="equilibrated">{t("equilibrated")}</option>
          <option value="speedFirst">{t("speedFirst")}</option>
          <option value="speedLast">{t("speedLast")}</option>
        </select>

          <button
            className="bg-blue-500 w-full hover:bg-blue-400 text-white py-2 px-4 border-b-4 transition-all duration-500 rounded-2xl mt-4 mr-2 h-auto"
            onClick={() => generateGroup()}
          >
            {t("generate-groups")}
          </button>

          <button
            className="bg-blue-500 w-full hover:bg-blue-400 text-white py-2 px-4 border-b-4 transition-all duration-500 rounded-2xl mt-4 mr-2 h-auto"
            onClick={() => copyEmails()}
          >
            {t("copy-accepted-emails")}
          </button>

          <button
            className="bg-blue-500 w-full hover:bg-blue-400 text-white py-2 px-4 border-b-4 transition-all duration-500 rounded-2xl mt-4 mr-2 h-auto"
            onClick={() => copyEmails(false)}
          >
            {t("copy-pending-emails")}
          </button>
          {/* <button
            className="bg-blue-500 w-full hover:bg-blue-400 text-white py-2 px-4 border-b-4 transition-all duration-500 rounded-2xl mt-4 mr-2 h-auto"
            onClick={() => saveWcif()}
          >
            Guardar WCIF
          </button> */}
        </>}
      </div>

      {showPersonTable && (
        <div className="mt-4">
          {wcif?.persons?.length > 0 ? (
            <PersonTable
              wcif={wcif}
              events={data.events}
              groupsByEvent={groupsByEvent}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default Competion;
