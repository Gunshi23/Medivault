export default function PrescriptionForm({ prescriptions, setPrescriptions }) {
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" }
    ]);
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = prescriptions.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setPrescriptions(updated);
  };

  return (
    <div className="prescription-builder">
      <div className="prescription-header">
        <h4>💊 Prescribed Medicines</h4>
        <button type="button" className="btn-secondary btn-sm" onClick={addPrescription}>
          + Add Medicine
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="muted small">No medicines added yet. Click "+ Add Medicine" above.</p>
      ) : (
        <div className="prescription-list">
          {prescriptions.map((item, index) => (
            <div key={index} className="prescription-row-card">
              <div className="prescription-row-header">
                <span>Medicine #{index + 1}</span>
                <button
                  type="button"
                  className="btn-danger-text"
                  onClick={() => removePrescription(index)}
                >
                  Remove
                </button>
              </div>
              <div className="form-grid-2">
                <input
                  placeholder="Medicine Name (e.g. Paracetamol)"
                  required
                  value={item.medicineName}
                  onChange={(e) => handleChange(index, "medicineName", e.target.value)}
                />
                <input
                  placeholder="Dosage (e.g. 500 mg)"
                  required
                  value={item.dosage}
                  onChange={(e) => handleChange(index, "dosage", e.target.value)}
                />
              </div>
              <div className="form-grid-3">
                <input
                  placeholder="Frequency (e.g. 2 times/day)"
                  required
                  value={item.frequency}
                  onChange={(e) => handleChange(index, "frequency", e.target.value)}
                />
                <input
                  placeholder="Duration (e.g. 5 days)"
                  required
                  value={item.duration}
                  onChange={(e) => handleChange(index, "duration", e.target.value)}
                />
                <input
                  placeholder="Instructions (e.g. After meals)"
                  value={item.instructions}
                  onChange={(e) => handleChange(index, "instructions", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
