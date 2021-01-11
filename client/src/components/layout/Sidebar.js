import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
//import { connect } from 'react-redux';

export const Sidebar = [
  // {
  //   title: 'Rules overview',
  //   path: '/overview',
  //   icon: <AiIcons.AiFillBook />,
  //   cName: 'nav-text',
  // },
  {
    title: 'Maps',
    path: '/maps',
    icon: <IoIcons.IoMdMap />,
    cName: 'nav-text',
  },
  {
    title: 'CEP entities',
    path: '/processedentities',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text',
  },
  {
    title: 'Topics',
    path: '/topics',
    icon: <FaIcons.FaNewspaper />,
    cName: 'nav-text',
  },
  {
    title: 'Charts',
    path: '/chart',
    icon: <FaIcons.FaChartBar />,
    cName: 'nav-text',
  },
  {
    title: 'Cameras',
    path: '/cameras',
    icon: <FaIcons.FaCameraRetro />,
    cName: 'nav-text',
  },
  {
    title: 'Rules list',
    path: '/ruleslist',
    icon: <FaIcons.FaEye />,
    cName: 'nav-text',
  },
  // {
  //   title: 'Add rule',
  //   path: '/addfirstrule',
  //   icon: <FaIcons.FaRuler />,
  //   cName: 'nav-text',
  // },
];

//const mapStateToProps = (state) => ({});

// export default connect(mapStateToProps)(Sidebar);
