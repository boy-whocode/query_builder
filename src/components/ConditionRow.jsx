import React from "react";
import PropTypes from "prop-types";
import { FIELD_OPTIONS, OPERATOR_OPTIONS } from "../constants/queryFields";

export default function ConditionRow({
  condition,
  onChange,
  onRemove,
  removable,
}) {
  return (
    <div className="flex items-center gap-3">
      <select
        className="border px-2 py-1 rounded"
        value={condition.field}
        onChange={(e) => onChange("field", e.target.value)}
      >
        {Object.keys(FIELD_OPTIONS).map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>

      <select
        className="border px-2 py-1 rounded"
        value={condition.operator}
        onChange={(e) => onChange("operator", e.target.value)}
      >
        {OPERATOR_OPTIONS.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      <select
        className="border px-2 py-1 rounded"
        value={condition.value}
        onChange={(e) => onChange("value", e.target.value)}
      >
        {FIELD_OPTIONS[condition.field]?.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>

      {removable && (
        <button onClick={onRemove} className="text-red-500 hover:underline">
          Remove
        </button>
      )}
    </div>
  );
}

ConditionRow.propTypes = {
  condition: PropTypes.shape({
    field: PropTypes.string,
    operator: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  removable: PropTypes.bool,
};
