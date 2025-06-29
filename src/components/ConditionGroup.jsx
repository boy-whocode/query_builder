import React, { useState, useEffect } from 'react';
import ConditionRow from './ConditionRow';
import { FIELD_OPTIONS } from '../constants/queryFields';

const defaultCondition = {
  field: 'Status',
  operator: 'equals',
  value: 'Open'
};

const createGroup = () => ({
  logic: 'AND',
  conditions: [{ ...defaultCondition }]
});

export default function ConditionGroup({ isRoot = false, onChange=()=>{}, initialGroup = null }) {
  const [logic, setLogic] = useState(initialGroup?.logic || 'AND');
  const [conditions, setConditions] = useState(initialGroup?.conditions || [defaultCondition]);
  const [output, setOutput] = useState(null);

  // Handle nested group updates from children
  useEffect(() => {
    if (!isRoot && onChange) {
      const formatted = {
        logic,
        conditions
      };
      onChange(formatted);
    }
  }, [logic, conditions]);

  const handleFieldChange = (index, key, value) => {
    const updated = conditions.map((c, i) =>
      i === index ? { ...c, [key]: value } : c
    );

    // Reset value if field is changed
    if (key === "field") {
      updated[index].value = FIELD_OPTIONS[value][0];
    }

    setConditions(updated);
  };

  const addCondition = () => {
    setConditions((prev) => [...prev, { ...defaultCondition }]);
  };

  const removeCondition = (index) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    setConditions(updated);
  };

  const addGroup = () => {
    setConditions((prev) => [...prev, createGroup()]);
  };

  const updateNestedGroup = (index, updatedGroup) => {
    const updated = [...conditions];
    updated[index] = updatedGroup;
    setConditions(updated);
  };

  const renderCondition = (cond, index) => {
    if (cond.logic) {
      // Nested group
      return (
        <div key={index} className="ml-4 pl-4 border-l-4 border-blue-400 mt-3">
          <ConditionGroup
            isRoot={false}
            onChange={(updatedGroup) => updateNestedGroup(index, updatedGroup)}
            initialGroup={cond}
          />
        </div>
      );
    }

    return (
      <ConditionRow
        key={index}
        condition={cond}
        onChange={(key, value) => handleFieldChange(index, key, value)}
        onRemove={() => removeCondition(index)}
        removable={conditions.length > 1}
      />
    );
  };

  const isValidCondition = (cond) => cond.field && cond.operator && cond.value;

  const handleSubmit = () => {
    const invalid = conditions.some((c) => c.logic ? false : !isValidCondition(c));

    if (invalid) {
      alert('Please fill all fields in every condition.');
      return;
    }

    const result = {
      logic,
      conditions
    };

    setOutput(result);
  };

  return (
    <div className="bg-gray-50 p-4 rounded border mt-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="font-semibold">Logic:</label>
        <select
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>

      <div className="space-y-3">
        {conditions.map((cond, i) => renderCondition(cond, i))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={addCondition}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Condition
        </button>

        <button
          onClick={addGroup}
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
        >
          Add Group
        </button>

        {isRoot && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>

      {isRoot && output && (
        <div className="mt-6 bg-gray-100 p-4 rounded font-mono text-sm whitespace-pre-wrap">
          <h3 className="font-semibold mb-2">📄 Output JSON:</h3>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
