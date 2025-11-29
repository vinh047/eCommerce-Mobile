import { useEffect, useRef, useState } from "react";

export function FilterDropdown({ label, options, selectedValues, onSelectionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (value, checked) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onSelectionChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-700 dark:text-white cursor-pointer transition duration-150 ease-in-out"
      >
        <span>{label}</span>
        <i
          className={`fas fa-chevron-down text-sm transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-20">
          <div className="p-3 space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 -m-1 transition duration-100"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                />
                <span className="text-sm dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
