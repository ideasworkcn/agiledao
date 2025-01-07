export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">403 - 没有访问权限</h1>
        <p className="text-gray-600 mb-6">
          您没有权限访问此页面。如果您认为这是一个错误，请联系管理员。
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}
