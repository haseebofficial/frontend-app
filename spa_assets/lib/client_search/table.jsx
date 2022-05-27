import "client_search/_styles/table.scss";
import React, { useEffect, useState } from "react";
import Pagination from "client_utils/pagination";
import { $host } from "../http";
import axios from "axios";
import { format, set } from "date-fns";
import { useHistory, useParams } from "react-router-dom";
import { t } from "i18n";

export default function ClientSearchTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  let paramsLocale = useParams().locale;

  const getSearches = async () => {
    setIsLoading(true);
    try {
      let data = await $host(
        `searches?page=${currentPage}&locale=${paramsLocale}`
      ).then((res) => res.data);
      console.log(data);
      setData(data.searches);
      setPagination(data.pagination);
      setIsLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    getSearches();
  }, [currentPage]);

  return (
    <div className="client-search-table">
      <table>
        <thead className="table-header">
          <tr>
            <th>{t("global.searches_index_page.created_at")}</th>
            <th>{t("global.searches_index_page.city")}</th>
            <th>{t("global.searches_index_page.languages")}</th>
            <th>{t("global.searches_index_page.intervals")}</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            data?.map((item, i) => {
              return (
                <tr
                  onClick={() => window.open(`searches/${item.id}`, "_blank")}
                  className="table-row"
                  key={`client_searches_${i}`}
                >
                  <td>
                    {format(new Date(item?.created_at), "dd.MM.yyyy hh:mm")}
                  </td>
                  <td>
                    {item?.city?.name} - {item?.city?.country?.name}
                  </td>
                  <td>{item?.language_pair_text}</td>
                  <td>{item?.intervals_text}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {isLoading && (
        <div
          className="columns is-flex is-vcentered is-centered"
          style={{ marginTop: 30 }}
        >
          <a style={{ border: "none" }} className="button is-loading">
            Loading
          </a>
        </div>
      )}
      {!isLoading && (
        <Pagination
          pagination={pagination}
          onChangePage={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
