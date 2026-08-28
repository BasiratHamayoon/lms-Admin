

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@maincomponents/components/ui/avatar";
import { Badge } from "@maincomponents/components/ui/badge";
import { Button } from "@maincomponents/components/ui/button";
import BaseTable from "./BaseTable";
import {
  CreditCard,
  Calendar,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Banknote,
  Receipt,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@maincomponents/components/ui/dropdown-menu";

const PaymentHistoryTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  showPagination = true,
  isRTL = false,
  currentLanguage = "en",
  searchTerm = "",
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  dynamicFilters = {},
  loading = false,
}) => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "staff",
        label: "salary.form.staff",
        width: "min-w-[180px]",
        align: "left",
      },
      {
        key: "paymentInfo",
        label: "salary.payment.recordPayment",
        width: "min-w-[200px]",
        align: "center",
      },
      {
        key: "method",
        label: "salary.payment.paymentMethod",
        width: "min-w-[120px]",
        align: "center",
      },
      {
        key: "date",
        label: "salary.form.paymentDate",
        width: "min-w-[120px]",
        align: "center",
      },
      {
        key: "status",
        label: "salary.form.paymentStatus",
        width: "min-w-[100px]",
        align: "center",
      },
      {
        key: "receipt",
        label: "salary.payment.paymentProof",
        width: "min-w-[100px]",
        align: "center",
      },
    ];

    if (isRTL) {
      return [
        { key: "actions", label: "common.actions", width: "w-28", align: "center" },
        ...baseColumns,
        { key: "index", label: "#", width: "w-12", align: "center" },
      ];
    } else {
      return [
        { key: "index", label: "#", width: "w-12", align: "center" },
        ...baseColumns,
        { key: "actions", label: "common.actions", width: "w-28", align: "center" },
      ];
    }
  }, [isRTL]);

  const colors = {
    primary: "from-green-500 to-green-600",
    gradient: "bg-gradient-to-r from-green-500 to-green-600",
    badge: "bg-gradient-to-r from-green-500 to-green-600",
  };

  const emptyState = {
    icon: CreditCard,
    title: "salary.noPaymentsFound",
    description: "salary.noPaymentsDesc",
  };

  const filterOptions = useMemo(() => {
    const options = {
      status: ["all", "completed", "pending", "processing", "failed", "cancelled"],
      paymentMethod: ["all", "bank-transfer", "cash", "check", "online"],
      month: [],
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueMonths = [
        ...new Set(
          data
            .map((item) => {
              const date = item.date || item.paymentDate;
              if (date) {
                return new Date(date).getMonth() + 1;
              }
              return null;
            })
            .filter(Boolean)
        ),
      ];

      options.month = ["all", ...uniqueMonths.sort((a, b) => a - b)];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    {
      key: "status",
      label: "common.status",
      options: filterOptions.status || [],
    },
    {
      key: "paymentMethod",
      label: "salary.payment.paymentMethod",
      options: filterOptions.paymentMethod || [],
    },
    {
      key: "month",
      label: "salary.form.month",
      options: filterOptions.month || [],
    },
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === "all") return t("common.all");

    const translationMap = {
      status: {
        completed: t("salary.paymentConfirmed"),
        pending: t("leave.status.pending"),
        processing: t("salary.paymentProcessing"),
        failed: t("salary.paymentFailed"),
        cancelled: t("leave.status.cancelled"),
      },
      paymentMethod: {
        "bank-transfer": t("salary.paymentMethods.bank-transfer"),
        cash: t("salary.paymentMethods.cash"),
        check: t("salary.paymentMethods.check"),
        online: t("salary.paymentMethods.online"),
      },
      month: {
        1: t("salary.months.1"),
        2: t("salary.months.2"),
        3: t("salary.months.3"),
        4: t("salary.months.4"),
        5: t("salary.months.5"),
        6: t("salary.months.6"),
        7: t("salary.months.7"),
        8: t("salary.months.8"),
        9: t("salary.months.9"),
        10: t("salary.months.10"),
        11: t("salary.months.11"),
        12: t("salary.months.12"),
      },
    };

    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: "bg-green-50 dark:bg-green-900/20",
    activeText: "text-green-700 dark:text-green-300",
    activeBorder: "border-green-200 dark:border-green-700",
    badge: "bg-green-500",
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300",
      pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
      processing:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
      failed:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300",
      cancelled:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300",
    };
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      completed: CheckCircle,
      pending: Clock,
      processing: AlertCircle,
      failed: XCircle,
      cancelled: XCircle,
    };
    return iconMap[status] || Clock;
  };

  const getMethodIcon = (method) => {
    const iconMap = {
      "bank-transfer": Banknote,
      cash: CreditCard,
      check: CreditCard,
      online: CreditCard,
    };
    return iconMap[method] || CreditCard;
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(
        isArabic ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      isArabic ? "ar-SA" : "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }
    ).format(amount);
  };

  const getMethodLabel = (method) => {
    const methodMap = {
      "bank-transfer": t("salary.paymentMethods.bank-transfer"),
      cash: t("salary.paymentMethods.cash"),
      check: t("salary.paymentMethods.check"),
      online: t("salary.paymentMethods.online"),
    };
    return methodMap[method] || method;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      completed: t("salary.paymentConfirmed"),
      pending: t("leave.status.pending"),
      processing: t("salary.paymentProcessing"),
      failed: t("salary.paymentFailed"),
      cancelled: t("leave.status.cancelled"),
    };
    return statusMap[status] || status;
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case "index":
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(currentPage - 1) * pageSize + index + 1}
          </span>
        );

      case "staff": {
        const staffData = item.staff || {};

        let staffName;
        if (isArabic && staffData.nameAr) {
          staffName = staffData.nameAr;
        } else {
          staffName = staffData.name || t("common.unknown") || "Unknown";
        }

        const staffId = staffData.staffId || "-";
        const rawRole = staffData.role || "";
        const staffRole = rawRole
          ? t(`roles.${rawRole}`, { defaultValue: rawRole })
          : "";

        return (
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600">
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs">
                {getUserInitials(staffData.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {staffName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {staffId}
              </p>
              {staffRole && (
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {staffRole}
                </p>
              )}
            </div>
          </div>
        );
      }

      case "paymentInfo": {
        const displayId = item.paymentId || item.transactionId || "";
        return (
          <div className="text-center space-y-1">
            <div className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(item.amount)}
            </div>
            {item.month && item.year && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("salary.for")}: {item.month}/{item.year}
              </div>
            )}
            {displayId && (
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                #{displayId}
              </div>
            )}
            {item.description && (
              <div
                className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] mx-auto"
                title={item.description}
              >
                {item.description}
              </div>
            )}
          </div>
        );
      }

      case "method": {
        const MethodIcon = getMethodIcon(item.method);
        return (
          <div className="flex flex-col items-center gap-1">
            <MethodIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {getMethodLabel(item.method)}
            </span>
          </div>
        );
      }

      case "date":
        return (
          <div className="text-center">
            <div
              className={`flex items-center justify-center gap-1 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(item.date)}
              </span>
            </div>
          </div>
        );

      case "status": {
        const StatusIcon = getStatusIcon(item.status);
        return (
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(
              item.status
            )} shadow-sm flex items-center gap-1 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <StatusIcon className="w-3 h-3" />
            {getStatusLabel(item.status)}
          </Badge>
        );
      }

      case "receipt": {
        const hasReceipt = item.receiptUrl;
        return (
          <div className="flex justify-center">
            {hasReceipt ? (
              <Badge
                variant="outline"
                className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 flex items-center gap-1"
              >
                <Receipt className="w-3 h-3" />
                {isRTL ? "متوفر" : "Available"}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
              >
                {isRTL ? "غير متوفر" : "Not Available"}
              </Badge>
            )}
          </div>
        );
      }

      case "actions":
        return (
          <div
            className={`flex items-center justify-center ${
              isRTL ? "justify-end" : "justify-start"
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700 transition-all duration-300"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
                style={{ direction: isRTL ? "rtl" : "ltr" }}
              >
                <DropdownMenuItem
                  onClick={() => onView && onView(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {t("common.view")}
                </DropdownMenuItem>
                {/* Add edit/delete if needed */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item[column.key]}
          </span>
        );
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="payment-history"
      title={t("salary.paymentHistory")}
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={i18n.language}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filters={filters}
      onFilterChange={onFilterChange}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      serverSidePagination={true}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
    />
  );
};

export default PaymentHistoryTable;