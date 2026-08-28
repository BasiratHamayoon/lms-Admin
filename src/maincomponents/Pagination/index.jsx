import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TablePagination = ({ totalPages, limit, totalRecords, currentPage, onPageChange, onLimitChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return totalRecords > 0 ? (
    <div className={`w-full flex justify-between items-center py-5 px-3 border-t dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className='hidden md:block text-gray-600 dark:text-gray-400'>
        <p>
          {isRTL ? (
            <>
              عرض {currentPage > 1 ? (currentPage - 1) * limit : 1} إلى {currentPage * limit} من {totalRecords} إدخال
            </>
          ) : (
            <>
              Showing {currentPage > 1 ? (currentPage - 1) * limit : 1} to {currentPage * limit} of {totalRecords} entries
            </>
          )}
        </p>
      </div>
      
      <select
        value={limit}
        onChange={e => {
          onLimitChange(e.target.value);
        }}
        className={`py-1 border border-gray-300 dark:border-gray-600 rounded-md px-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 ${isRTL ? 'text-right' : ''}`}
      >
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='25'>25</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
      
      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} gap-2`}>
        {/* Previous Button */}
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-lg text-lg transition-all duration-300 ${
            currentPage === 1 
              ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
              : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Page Numbers */}
        {!isRTL ? (
          // LTR Layout
          <>
            {/* First page */}
            <button
              onClick={() => {
                onPageChange(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                currentPage === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              1
            </button>

            {/* Ellipsis before middle pages */}
            {currentPage > 3 && <span className='px-2 text-gray-500 dark:text-gray-400'>...</span>}

            {/* Middle pages */}
            {Array.from({ length: 3 }, (_, i) => {
              const page = currentPage === totalPages ? currentPage - 2 + i : currentPage - 1 + i;
              return page > 1 && page < totalPages ? (
                <button
                  key={page}
                  onClick={() => {
                    onPageChange(page);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            })}

            {/* Ellipsis after middle pages */}
            {currentPage < totalPages - 2 && <span className='px-2 text-gray-500 dark:text-gray-400'>...</span>}

            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => {
                  onPageChange(totalPages);
                }}
                className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                  currentPage === totalPages 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {totalPages}
              </button>
            )}
          </>
        ) : (
          // RTL Layout (Arabic - reversed order)
          <>
            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => {
                  onPageChange(totalPages);
                }}
                className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                  currentPage === totalPages 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* Ellipsis after middle pages */}
            {currentPage < totalPages - 2 && <span className='px-2 text-gray-500 dark:text-gray-400'>...</span>}

            {/* Middle pages */}
            {Array.from({ length: 3 }, (_, i) => {
              const page = currentPage === totalPages ? currentPage - 2 + i : currentPage - 1 + i;
              return page > 1 && page < totalPages ? (
                <button
                  key={page}
                  onClick={() => {
                    onPageChange(page);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            })}

            {/* Ellipsis before middle pages */}
            {currentPage > 3 && <span className='px-2 text-gray-500 dark:text-gray-400'>...</span>}

            {/* First page */}
            <button
              onClick={() => {
                onPageChange(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                currentPage === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              1
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded-lg text-lg transition-all duration-300 ${
            currentPage === totalPages 
              ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
              : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  ) : null;
};

export default TablePagination;