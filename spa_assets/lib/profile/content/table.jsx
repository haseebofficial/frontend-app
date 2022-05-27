import 'profile/_styles/content/table.scss';
import React, { useState, useContext, useEffect } from "react";
import {ContextSearchForm, ContextProfilePage} from "app/app_root";
import { Redirect } from "react-router-dom";
import routes from "app/routes";
import TableCard from 'profile/content/table_card';
import { useScrollElementTop } from 'react_utils/scroll_link';
import { ProfilePageContext } from 'profile/profile';
import {t} from 'i18n';

export default function ProfileTable({refPage}) {
  let { interpreter, search, locale } = useContext(ProfilePageContext)
  let [newInt, setNewInt] = useState(splitDateIntervals(String(search?.intervals_text)))
  console.log("new intervals: ", String(search?.intervals_text))
  console.log("new intervals render: ", splitDateIntervals(String(search?.intervals_text)))
  console.log("newInt: ", newInt)

  // console.log("new intervals: ", splitDateIntervals(search?.intervals_text))
  // useEffect(() => {
  //   setNewInt(splitDateIntervals(search?.intervals_text))
  // }, [search])
  let [isOrderCreated, setIsOrderCreated] = useState(false);
  let [selectedServices, setSelectedServices] = useState();
  let createOrder = (ser) => {
    setSelectedServices(ser)
    setIsOrderCreated(true);
  };
  let {showForm} = useContext(ContextProfilePage)
  let {showDateVisible} = useContext(ContextSearchForm)

  function changeDateAndTime() {
    showForm()
    showDateVisible()
    // scrollByTop()
    useScrollElementTop(refPage, -120)
  }

  if (isOrderCreated) {
    return <Redirect to={routes.spaNewOrderPath() + `?search_id=${search.id}&interpreter_id=${interpreter.id}&service_id=${selectedServices.id}`}/>;
  } else {
    return (
      <div className="profile-table">
        <table className="table is-fullwidth">
          <thead className="table-header">
            <tr>
              <th><span className="is-family-regular">{t("global.show_interpreter.available_services").replace('%{period}', splitDateIntervals(String(search?.intervals_text)))}</span> <br/> <button href='#' className="thead-link" onClick={changeDateAndTime}>{t("global.search_page.change_date")}</button></th>
              <th className="table-header-price" colSpan="2"><button href='#' className="thead-link-price" onClick={changeDateAndTime}>{t("global.search_page.change_date")}</button> <span>{t("global.show_interpreter.price")} {t("global.for")} {search?.duration_text}</span></th>
            </tr>
          </thead>
          <tbody>
            {/* <tr className="table-row">
              <td>
                <span className="is-family-regular">Переводчик на выставке</span> <br/>
                Бесплатная отмена  |  Cкидка -40 %</td>
              <td className="table-price">128.0 EUR</td>
              <td>
                <button className="table-btn button is-interpreters-yellow" onClick={createOrder}>Заказать</button>
              </td>
            </tr>
            <tr className="table-row">
              <td>
                <span className="is-family-regular">Переводчик на выставке</span> <br/>
                Бесплатная отмена  |  Cкидка -40 %</td>
              <td className="table-price">128.0 EUR</td>
              <td>
                <button className="table-btn button is-interpreters-yellow" onClick={createOrder}>Заказать</button>
              </td>
            </tr> */}
            {interpreter?.service && interpreter.service.map(ser => {
              return <TableCard key={ser.id} service={ser} search={search} createOrder={() => createOrder(ser)} changeDateAndTime={changeDateAndTime} locale={locale}/>
            })}
          </tbody>
        </table>
        <span className="table-footer">{t("global.show_interpreter.star_text")}</span>
{/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
{/* <br/>
        <div className='table is-fullwidth'>
          <div className="table-header">
            <div className="table-th"><span className="is-family-regular">Услуги, доступные для заказа 13 апреля (10:00 - 18:00):</span> <br/> <button href='#' className="thead-link" onClick={changeDateAndTime}>Изменить дату, время?</button></div>
            <div className="table-th table-header-price" colspan="2"><button href='#' className="thead-link-price" onClick={changeDateAndTime}>Изменить дату, время?</button> <span>Стоимость* за 8 часов</span></div>
          </div>

          <div className="table-body">
            <div className="table-row table-tr">
              <div className="table-td table-td-one">
                <span className="is-family-regular">Переводчик на выставке</span> <br/>
                Бесплатная отмена  |  Cкидка -40 %</div>
              <div className="table-price table-td table-td-two">128.0 EUR</div>
              <div className="table-td table-td-three">
                <button className="table-btn button is-interpreters-yellow" onClick={createOrder}>Заказать</button>
              </div>
            </div>
            <div className="table-row table-tr">
              <div className="table-td table-td-one">
                <span className="is-family-regular">Переводчик на выставке</span> <br/>
                Бесплатная отмена  |  Cкидка -40 %</div>
              <div className="table-price table-td table-td-two">128.0 EUR</div>
              <div className="table-td table-td-three">
                <button className="table-btn button is-interpreters-yellow" onClick={createOrder}>Заказать</button>
              </div>
            </div>
            <TableCard createOrder={createOrder} serviceType="Pgudew" />
          </div>
        </div> */}
{/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

        <div className="table-info">
          <div>
            <i className="fas fa-info-circle"></i>
          </div>

          <div className="table-info-content">
            <span className="table-info-title">  {t("global.show_interpreter.how_to_order.title").replace("%{city}", search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}</span>
            {/* <ul className="table-list"> */}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {/* <li>Нажать "Заказать" напротив выбранной услуги</li>
              <li>Оформить заказ кредитной картой или получив счет для оплаты банковским переводом. Также вы можете выбрать вариант оплаты наличными переводчику.</li>
              <li>Получить подтверждение заказа и Ваучер с данными для контакта с переводчиком</li> */}
            {/* </ul> */}
            <p dangerouslySetInnerHTML={{__html: t("global.show_interpreter.how_to_order.text")}}></p>
          </div>

        </div>
      </div>
    );
  }
}

function splitDateIntervals(string) {
  let intervals = string.split(",")
  let newInterval = []
  for (let i =0; i < intervals.length; i++) {
    let interval = intervals[i].replace(/ +/g, ' ').trim().split(' ');
    let string = interval[5] + " " + interval[6] + " (" + interval[1] + " - " + interval[3] + ")"
    newInterval.push(string)
  }
  return newInterval.join(", ")
}