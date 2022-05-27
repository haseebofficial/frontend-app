import "client_orders/_styles/client_orders.scss";
import React, {useState, useEffect} from "react";
import LayoutBody from "layout/layout_body";
import ClientTabs from "client_utils/tabs";
import {AvatarCircle} from "../user/avatar";
import Pagination from "../client_utils/pagination";
import { Link } from "react-router-dom";
import routes from "app/routes";
import {$host, $authHost} from "../http"
import axios from "axios";
import { format } from 'date-fns'
import {t} from 'i18n';
import { useParams } from 'react-router-dom';

export default function ClientOrders() {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const {locale} = useParams()

  const getOrders = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`orders?locale=${locale}&page=${currentPage}`).then(res => res.data)
      console.log(data)
      setData(data.orders)
      setPagination(data.pagination)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getOrders()
  }, [currentPage])

  return (
    <LayoutBody>
      <div className="client-orders">
        <ClientTabs>
          <li className="client-tabs-link active">
            {t("global.order_pages_sidebar.orders")}
          </li>
        </ClientTabs>

        {
          !isLoading ? data?.map((item, i) => {
            return (
              <div className="order-card" key={`client_orders_${i}`}>
                <div className="avatar">
                  <AvatarCircle src={item?.interpreter?.photo_url}/>
                </div>
                <div className="order-info">
                  <span className="name">{item?.interpreter?.name} {item?.interpreter?.surname}<span className="is-hidden-touch">,</span>
                    <span className="order-town"> {item?.search?.city?.name} - {item?.search?.city?.country?.name}</span>
                  </span>
                  <span className="order-number">#{item?.id} {t("global.show_order_page.from")} {format(new Date(item?.created_at), 'dd.MM.yyyy')}</span>
                  <span className="order-cancel">{item?.state}</span>
                  <span className="order-date">{item?.search?.intervals_text}</span>
                </div>
                <div className="button-wrapper">
                  <Link to={routes.spaOrderPath({id: item?.id})} className="button">{t("global.search_page.learn_more")}</Link>
                </div>
              </div>
            )
          })
          : <div className="columns is-flex is-vcentered is-centered"><a style={{border: 'none'}} className="button is-loading">Loading</a></div>
        }

        { !isLoading && <Pagination pagination={pagination} onChangePage={(page) => setCurrentPage(page)}/> }
      </div>
    </LayoutBody>
  );
}
