﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CreoPro.Controllers
{
    public class MachineController : Controller
    {
        private BLL.process bll_proc = null;
        private Model.process model_proc = null;

        #region 页面跳转
        /// <summary>
        /// 机床参数设置
        /// </summary>
        /// <returns></returns>
        public ActionResult machineSet()
        {
            return View();
        }
        #endregion

        /// <summary>
        /// 机床类型
        /// </summary>
        /// <returns></returns>
        public ActionResult machineType()
        {
            bll_proc = new BLL.process();
            List<Common.Process> list = bll_proc.GetProcMachList("p.machId is not null");
            ViewBag.list = list;
            return View();
        }

        /// <summary>
        /// 机床参数设置
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult getMachineSet()
        {
            int machId = Convert.ToInt32(Request["txtMachId"]);
            ViewBag.machName = Request["txtMachName"];

            BLL.machineDetail bll_md = new BLL.machineDetail();
            List<Model.machineDetail> list = bll_md.GetModelList("machId=" + machId);
            int count = list.Count;
            List<Model.machineDetail> sublist1 = new List<Model.machineDetail>();
            List<Model.machineDetail> sublist2 = new List<Model.machineDetail>();
            if (count > 0)
            {
                if (count <= 10)
                {
                    sublist1 = list;
                }
                else
                {
                    for (int i = 0; i < count; i++)
                    {
                        if (i < 10)
                        {
                            sublist1.Add(list[i]);
                        }
                        else
                        {
                            sublist2.Add(list[i]);
                        }
                    }
                }
            }
            ViewBag.list1 = sublist1;
            ViewBag.list2 = sublist2;
            return View("machineSet");
        }

    }
}
