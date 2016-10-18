﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common
{
    [Serializable]
    public class UserInfo
    {
        private string userName = "";
        private string userPwd = "";
        private int userRole = 0;
        private string creoSetup = "";
        private string creoWorkSpace = "";

        public string UserName
        {
            get { return userName; }
            set { userName = value; }
        }

        public string UserPwd
        {
            get { return userPwd; }
            set { userPwd = value; }
        }

        public int UserRole
        {
            get { return userRole; }
            set { userRole = value; }
        }

        public string CreoSetup
        {
            get { return creoSetup; }
            set { creoSetup = value; }
        }

        public string CreoWorkSpace
        {
            get { return creoWorkSpace; }
            set { creoWorkSpace = value; }
        }


    }
}
