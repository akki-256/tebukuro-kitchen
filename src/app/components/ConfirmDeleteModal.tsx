const ConfirmDeleteModal: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-80 rounded-2xl bg-white px-0 pt-6 text-center shadow-lg">
        {" "}
        <div className="px-6">
          {" "}
          <h2
            className="mb-2 text-xl font-bold"
            style={{ transform: "translateY(5px)" }}
          >
            レシピを削除しますか？
          </h2>
          <p
            className="mb-8 text-sm text-gray-600"
            style={{ transform: "translateY(15px)" }}
          >
            この操作は元に戻せません
          </p>
        </div>
        <hr className="w-full border-t border-gray-200" />
        <div className="flex divide-x">
          <button className="w-1/2 rounded-bl-2xl py-4 font-bold text-black hover:bg-gray-100">
            キャンセル
          </button>
          <button className="w-1/2 rounded-br-2xl py-4 font-bold text-orange-500 hover:bg-orange-50">
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
