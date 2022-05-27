import "client_call/_styles/show_call/table.scss";
import React, {useState, useEffect} from "react";
import Pagination from "client_utils/pagination";
import useVisible from "react_utils/use_visible";
import {AvatarCircle} from "user/avatar";
import {$host} from "../../http"
import axios from "axios";
import { format } from 'date-fns';
import {t} from 'i18n';
import { useParams } from 'react-router-dom';
import {ru, enUS, de, ja, arSA, zhCN, fr, es, it} from 'date-fns/locale';

export default function ClientCallTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const {locale} = useParams()

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`interpretation_calls?page=${currentPage}&locale=${locale}`).then(res => res.data)
      console.log(data)
      setData(data.interpretation_calls)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getData()
  }, [currentPage])

  return (
    <div className="client-call-table">
      {isLoading && <div className="columns is-flex is-vcentered is-centered"><a style={{border: 'none'}} className="button is-loading">Loading</a></div>}
      <table className="table" style={{width: '100%'}}>
        {
          !isLoading && data?.map((item, i) => {
            return (
              <InterpreterRow key={`interpretation_calls_${i}`} isPaid={item.state === 'completed' ? true : false} data={item}/>
            )
          })
        }
      </table>

      { !isLoading && <Pagination pagination={pagination} onChangePage={(page) => setCurrentPage(page)}/> }
    </div>
  );
}


function InterpreterRow({isPaid=false, data}) {
  let info = useVisible();
  const {locale} = useParams()
  const dateLocales = { 
      fr: fr, 
      en: enUS, 
      it: it, 
      es: es, 
      ja: ja, 
      ar: arSA, 
      zh: zhCN,
      ru: ru,
      de: de
    }

  return (
    <div className="row-wrapper">
      <div className="row" onClick={info.toggle}>
        <span style={{width: '15%'}}>{data?.interpreter?.name} {data?.interpreter?.surname}</span>
        {/* <span style={{width: '15%'}} className={isPaid ? " " : "row-spam-padding"}>({data?.language}-{data?.your_language})</span> */}
        <span style={{width: '15%'}}>({data?.language}-{data?.your_language})</span>
        <span style={{width: '15%'}}>{format(new Date(data?.created_at), 'dd MMMM yyyy, hh:mm', {locale: dateLocales[locale]})}</span>
        <span style={{width: '5%'}}>#{data?.id}</span>
        {
          isPaid
          ? <span style={{width: '10%', textAlign: 'left'}}>{data?.state === 'new' ? t("global.interpretation_call.new") : (data?.state === 'awaiting_payment' ? t("global.interpretation_call.awaiting_payment") : t("global.interpretation_call.completed"))}</span>
          : <span style={{width: '10%', textAlign: 'left'}} className="row-unpaid">{data?.state === 'new' ? t("global.interpretation_call.new") : (data?.state === 'awaiting_payment' ? t("global.interpretation_call.awaiting_payment") : t("global.interpretation_call.completed"))}</span>
        }
      </div>

      {info.isVisible && <InterpreterInfo isPaid={isPaid} data={data}/>}
    </div>
    // <>
    //   <tr style={{cursor: 'pointer'}} onClick={info.toggle}>
    //     <td>{data?.interpreter?.name} {data?.interpreter?.surname}</td>
    //     <td>({data?.language}-{data?.your_language})</td>
    //     <td>{format(new Date(data?.created_at), 'dd MMMM yyyy, hh:mm')}</td>
    //     <td>#{data?.id}</td>
    //     <td>
    //       {
    //         isPaid
    //         ? <span>{data?.state}</span>
    //         : <span className="row-unpaid">{data?.state}</span>
    //       }
    //     </td>
    //   </tr>
    //   {info.isVisible && <InterpreterInfo isPaid={isPaid} data={data}/>}
    // </>
  );
}

function InterpreterInfo({isPaid=false, data}) {
  return (
    <div className="collapse">
      <div className="avatar">
        <AvatarCircle src={data?.interpreter?.photo_url}/>
      </div>

      <div className="list-wrapper">
        <ul className="collapse-list">
          <li className="is-hidden-touch">{t("global.interpretation_call.date_start")} <span>{format(new Date(data?.created_at), 'yyyy-mm-dd hh:mm:ss z')}</span></li>
          <li> {t("global.interpretation_call.duration")} <span> {new Date(data?.duration * 1000).toISOString().substr(11, 8)}</span></li>
        </ul>

        <ul className="collapse-list">
          <li>{t("global.interpretation_call.price_minute")} <span>{data?.price_minute_with_expenses}€</span></li>
          <li> {t("global.interpretation_call.total_amount")}   <span>{data?.price_minute_with_expenses}€</span></li>
        </ul>
      {
        isPaid
        ? <ul className="collapse-list">
          <li>{t("global.interpretation_call.paid")}  <span> 1.3€</span></li>
        </ul>
        : <ul className="collapse-list-unpaid">
          <li className="collapse-list-link">
            <a href="#">Payment<br/>information</a>
          </li>
          <li>
            <button className="button">PAY</button>
          </li>
        </ul>
      }  
      </div>
    </div>
  );
}