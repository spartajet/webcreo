﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using Common;

namespace CreoPro.Controllers
{
    public class HomeController : Controller
    {
        creo_dataEntities db;
        private BLL.member bll_mem = null;
        private Model.member model_mem = null;

        public HomeController()
        {
            db = new creo_dataEntities();
        }

        /// <summary>
        /// 登录验证
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult loginValidate()
        {
            string username = Request["username"];
            string password = Request["password"];
            string isRemeber = Request["remember"];

            if (username != null)
            {
                bll_mem = new BLL.member();
                model_mem = new member();
                model_mem = bll_mem.GetMemberByName(username);
                if (password == model_mem.userPwd)
                {
                    if (isRemeber != null)//记住密码
                    {
                        if (isRemeber == "true")
                        {
                            //写入cookie，用于登录判断
                            HttpCookie Username = new HttpCookie("username", username);
                            HttpCookie Password = new HttpCookie("password", password);
                            Response.Cookies.Add(Username);
                            Response.Cookies.Add(Password); 
                        }
                    }
                    //写入Session，用于页面间传值
                    UserInfo userInfo = new UserInfo();
                    userInfo.UserName = model_mem.userName;
                    userInfo.UserPwd = model_mem.userPwd;
                    userInfo.UserRole = (int)model_mem.userRole;
                    userInfo.CreoSetup = model_mem.creoSetup;
                    userInfo.CreoWorkSpace = model_mem.creoWorkSpace;
                    Session["userEntity"] = userInfo;
                    return RedirectToAction("index", "mainForm");
                }
            }
            return null;
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <returns></returns>
        public ActionResult login()
        {
            HttpCookie Username = HttpContext.Request.Cookies["username"];
            HttpCookie Password = HttpContext.Request.Cookies["password"];
            if (Username != null && Password != null)//判断是否处于登录状态
            {
                bll_mem = new BLL.member();
                model_mem = new member();
                model_mem = bll_mem.GetMemberByName(Username.Value);
                if (Password.Value == model_mem.userPwd)
                {
                    //写入Session，用于页面间传值
                    UserInfo userInfo = new UserInfo();
                    userInfo.UserName = model_mem.userName;
                    userInfo.UserPwd = model_mem.userPwd;
                    userInfo.UserRole = (int)model_mem.userRole;
                    userInfo.CreoSetup = model_mem.creoSetup;
                    userInfo.CreoWorkSpace = model_mem.creoWorkSpace;
                    Session["userEntity"] = userInfo;
                    return RedirectToAction("index", "mainForm");
                }
            }
            return View();
        }

    }
}
