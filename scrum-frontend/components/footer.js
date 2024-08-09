"use client"; // 这是一个客户端组件

import Link from "next/link";
import { SiGitee, SiZhihu, SiTwitter, SiYoutube, SiBilibili } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        &copy; 2024 ideaswork. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          href="https://gitee.com/ideaswork/agiledao"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <SiGitee size={20} />
          <span className="sr-only">Gitee</span>
        </Link>
        <Link
          href="https://space.bilibili.com/28249524"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <SiBilibili size={20} />
          <span className="sr-only">Bilibili</span>
        </Link>
        <Link
          href="https://www.zhihu.com/people/wang-qing-gang-41"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <SiZhihu size={20} />
          <span className="sr-only">Zhihu</span>
        </Link>
        <Link
          href="https://twitter.com/wqg599252594"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <SiTwitter size={20} />
          <span className="sr-only">Twitter</span>
        </Link>
        <Link
          href="https://www.youtube.com/channel/UChxgfdsYVrQw-jy1IxWbSNA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <SiYoutube size={20} />
          <span className="sr-only">Youtube</span>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;