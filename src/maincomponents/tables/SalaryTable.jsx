

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@maincomponents/components/ui/avatar";
import { Badge } from "@maincomponents/components/ui/badge";
import { Button } from "@maincomponents/components/ui/button";
import BaseTable from "./BaseTable";
import {
  DollarSign,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock4,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@maincomponents/components/ui/dropdown-menu";

const SalaryTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onProcessPayment,
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
  const { t } = useTranslation();

  const columns = [
    { key: "index", label: "#", width: "w-12", align: "center" },
    {
      key: "staffName",
      label: "salary.form.staff",
      width: "min-w-[200px]",
      align: "left",
    },
    {
      key: "period",
      label: "salary.form.month",
      width: "min-w-[120px]",
      align: "center",
    },
    {
      key: "amount",
      label: "salary.form.amount",
      width: "min-w-[140px]",
      align: "center",
    },
    {
      key: "status",
      label: "salary.form.paymentStatus",
      width: "min-w-[130px]",
      align: "center",
    },
    {
      key: "dates",
      label: "salary.paymentDate",
      width: "min-w-[140px]",
      align: "center",
    },
    {
      key: "actions",
      label: "common.actions",
      width: "w-20",
      align: "center",
    },
  ];

  const colors = {
    primary: "from-indigo-500 to-indigo-600",
    gradient: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    badge: "bg-gradient-to-r from-indigo-500 to-indigo-600",
  };

  const emptyState = {
    icon: DollarSign,
    title: "salary.noSalaryFound",
    description: "salary.noSalaryDesc",
  };

  const filterOptions = useMemo(() => {
    const options = {
      status: ["all", "paid", "unpaid", "partially-paid", "processing", "overdue"],
      month: [],
      year: [],
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueMonths = [
        ...new Set(data.map((item) => item.month).filter(Boolean)),
      ];
      options.month = ["all", ...uniqueMonths.sort((a, b) => a - b)];

      const uniqueYears = [
        ...new Set(data.map((item) => item.year).filter(Boolean)),
      ];
      options.year = ["all", ...uniqueYears.sort((a, b) => b - a)];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    {
      key: "status",
      label: "common.status",
      options: filterOptions.status,
    },
    {
      key: "month",
      label: "salary.form.month",
      options: filterOptions.month,
    },
    {
      key: "year",
      label: "common.year",
      options: filterOptions.year,
    },
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === "all") return t("common.all");

    const translationMap = {
      status: {
        paid: t("salary.status.paid"),
        unpaid: t("salary.status.unpaid"),
        "partially-paid": t("salary.status.partial"),
        partial: t("salary.status.partial"),
        processing: t("salary.status.processing"),
        overdue: t("salary.status.overdue"),
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
    activeBg: "bg-indigo-50 dark:bg-indigo-900/20",
    activeText: "text-indigo-700 dark:text-indigo-300",
    activeBorder: "border-indigo-200 dark:border-indigo-700",
    badge: "bg-indigo-500",
  };

  const getStatusColor = (status) => {
    const statusColors = {
      paid:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300",
      unpaid:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300",
      "partially-paid":
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
      partial:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
      processing:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
      overdue:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
    };
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      paid: CheckCircle,
      unpaid: XCircle,
      "partially-paid": AlertCircle,
      partial: AlertCircle,
      processing: Clock4,
      overdue: AlertTriangle,
    };
    return iconMap[status] || Clock;
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
        currentLanguage === "ar" ? "ar-SA" : "en-US",
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
      currentLanguage === "ar" ? "ar-SA" : "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }
    ).format(amount);
  };

  const getMonthName = (month) => {
    const monthNames = {
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
    };
    return monthNames[month] || `Month ${month}`;
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case "index":
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(currentPage - 1) * pageSize + index + 1}
          </span>
        );

      case "staffName": {
        const displayName =
          item.staffName && item.staffName.trim() !== ""
            ? item.staffName
            : t("common.unknownStaff") || "Unknown Staff";
        return (
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm">
                {getUserInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {displayName}
              </p>
              {item.staffRole && (
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {item.staffRole}
                </p>
              )}
            </div>
          </div>
        );
      }

      case "period":
        return (
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium block">
                {getMonthName(item.month)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.year}
              </span>
            </div>
          </div>
        );

      case "amount":
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900 dark:text-white font-bold">
              {formatCurrency(item.amount)}
            </span>
            {(item.bonus > 0 || item.deductions > 0) && (
              <div
                className={`flex items-center justify-center gap-2 mt-1 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {item.bonus > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0.5"
                  >
                    <span className="text-green-600 dark:text-green-400">
                      +{formatCurrency(item.bonus)}
                    </span>
                  </Badge>
                )}
                {item.deductions > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0.5"
                  >
                    <span className="text-red-600 dark:text-red-400">
                      -{formatCurrency(item.deductions)}
                    </span>
                  </Badge>
                )}
              </div>
            )}
          </div>
        );

      case "status": {
        const statusKey =
          item.status === "partially-paid" ? "partial" : item.status;
        const statusText = t(`salary.status.${statusKey}`, statusKey);
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
            {statusText}
          </Badge>
        );
      }

      case "dates":
        if (!item.paymentDate && !item.dueDate)
          return <span className="text-gray-400">-</span>;

        return (
          <div className="text-center space-y-1">
            {item.dueDate && (
              <div
                className={`flex items-center justify-center gap-1 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {formatDate(item.dueDate)}
                </span>
              </div>
            )}
            {item.paymentDate && (
              <div
                className={`flex items-center justify-center gap-1 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <CreditCard className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {formatDate(item.paymentDate)}
                </span>
              </div>
            )}
          </div>
        );

      case "actions":
        return (
          <div
            className={`flex items-center justify-center gap-1 ${
              isRTL ? "flex-row-reverse" : ""
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
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {t("common.view")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onProcessPayment && onProcessPayment(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  {t("salary.processPayment")}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(item.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
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
      type="salary"
      title="salary.salaryMembers"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
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

export default SalaryTable;