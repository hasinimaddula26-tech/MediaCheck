const allSymptoms = {
    'crying': { name: 'Persistent crying or irritability', desc: 'Continuous discomfort not easily soothed', weight: 1.5 },
    'abdominal': { name: 'Abdominal swelling or bloating', desc: 'Unusual distension or chronic pain in the belly', weight: 1.5 },
    'feeding': { name: 'Poor feeding or refusal to eat', desc: 'Refusal to eat normally for extended periods', weight: 1 },
    'growth': { name: 'Failure to gain weight', desc: 'Significant lack of growth according to growth curves', weight: 2 },
    'vomiting': { name: 'Persistent vomiting', desc: 'Frequent, unexplained vomiting', weight: 1.5 },
    'pale': { name: 'Pale Skin', desc: 'Noticeable pallor, sluggishness or lack of color', weight: 1 },
    'lump': { name: 'Visible Lump or Swelling', desc: 'Firm, unusual masses anywhere on the body', weight: 2 },
    'delay': { name: 'Developmental delay or regression', desc: 'Losing previously acquired milestones', weight: 1.5 },
    'infections': { name: 'Frequent infections', desc: 'Recurrent severe infections', weight: 1 },
    'eye_swelling': { name: 'Swelling around eyes', desc: 'Proptosis or typical raccoon eyes appearance', weight: 2 },
    'fever': { name: 'Persistent or Prolonged Fever', desc: 'Fever lasting days without an obvious source', weight: 1 },
    'fatigue': { name: 'Fatigue or low energy', desc: 'Unexplained tiredness not relieved by rest', weight: 1 },
    'bonePain': { name: 'Bone or Joint Pain', desc: 'Pain especially at night or causing limping', weight: 2 },
    'lymph': { name: 'Swollen Lymph Nodes', desc: 'Persistent swelling in the neck, armpits, or groin', weight: 1 },
    'weightLoss': { name: 'Unexplained Weight Loss', desc: 'Significant drop in weight without diet changes', weight: 2 },
    'appetite': { name: 'Loss of Appetite', desc: 'Refusal to eat normally for extended periods', weight: 1 },
    'bruising': { name: 'Easy Bruising or Bleeding', desc: 'Frequent bruises or bleeding without severe trauma', weight: 2 },
    'headaches_vomiting': { name: 'Headaches with vomiting', desc: 'Severe headaches often accompanied by vomiting', weight: 2 },
    'headaches': { name: 'Headaches (severe/frequent)', desc: 'Persistent and worsening headaches', weight: 1.5 },
    'vomiting_morning': { name: 'Vomiting (especially morning)', desc: 'Morning vomiting which could indicate increased intracranial pressure', weight: 2 },
    'decline': { name: 'Decline in activity/school', desc: 'Noticeable drop in usual energy and cognitive engagement', weight: 1 }
};

const symptomsByAge = {
    '0-3': ['crying', 'abdominal', 'feeding', 'growth', 'vomiting', 'pale', 'lump', 'delay', 'infections', 'eye_swelling'],
    '3-6': ['fever', 'fatigue', 'bonePain', 'lymph', 'weightLoss', 'appetite', 'infections', 'bruising', 'headaches_vomiting', 'lump'],
    '6-10': ['fatigue', 'fever', 'bonePain', 'weightLoss', 'lymph', 'headaches', 'vomiting_morning', 'bruising', 'lump', 'decline']
};

// Common Pediatric Differential Diagnoses
const diseasesDatabase = [
    {
        name: 'Pediatric Malignancy (e.g., Leukemia / Lymphoma / Neuroblastoma)',
        desc: 'Possible childhood cancer requiring immediate medical evaluation. Often presents with severe combinations of these red-flag symptoms.',
        symptoms: ['crying', 'abdominal', 'growth', 'vomiting', 'pale', 'lump', 'eye_swelling', 'fever', 'fatigue', 'bonePain', 'lymph', 'weightLoss', 'bruising', 'headaches_vomiting', 'headaches', 'vomiting_morning', 'decline'],
        color: '#dc2626'
    },
    {
        name: 'Infectious Mononucleosis (EBV) / Viral Illness',
        desc: 'A very common viral infection in children causing significant fatigue, prolonged fevers, and prominently swollen glands.',
        symptoms: ['fatigue', 'fever', 'lymph', 'appetite', 'feeding', 'infections', 'crying'],
        color: '#3b82f6'
    },
    {
        name: 'Juvenile Idiopathic Arthritis (JIA)',
        desc: 'The most common type of arthritis in kids, causing chronic joint inflammation, bone pain, and sometimes fevers.',
        symptoms: ['bonePain', 'fever', 'fatigue', 'lymph', 'pale', 'crying'],
        color: '#f59e0b'
    },
    {
        name: 'Idiopathic Thrombocytopenic Purpura (ITP)',
        desc: 'A benign blood disorder causing easy bruising and bleeding due to low platelets, often following a viral illness.',
        symptoms: ['bruising', 'pale', 'fatigue'],
        color: '#ef4444'
    },
    {
        name: 'Iron Deficiency Anemia',
        desc: 'Lack of healthy red blood cells leading to a tired, exceedingly pale appearance and loss of appetite or developmental delay.',
        symptoms: ['fatigue', 'pale', 'appetite', 'feeding', 'delay', 'decline'],
        color: '#8b5cf6'
    },
    {
        name: 'Gastroenteritis / Celiac Disease',
        desc: 'Inflammation of the digestive tract or severe gluten intolerance causing abdominal issues and weight weight drop.',
        symptoms: ['abdominal', 'weightLoss', 'appetite', 'fatigue', 'pale', 'vomiting', 'growth', 'feeding', 'crying'],
        color: '#10b981'
    },
    {
        name: 'Osteomyelitis / Growing Pains',
        desc: 'Bone infection requiring antibiotics, or merely standard childhood growing pains (which occur predominantly at night).',
        symptoms: ['bonePain', 'fever', 'crying', 'fatigue'],
        color: '#6366f1'
    },
    {
        name: 'Benign Cysts / Local Trauma',
        desc: 'Non-cancerous tissue growths (like lipomas) or swelling/bruising resulting from active play and everyday injuries.',
        symptoms: ['lump', 'bruising', 'abdominal'],
        color: '#64748b'
    },
    {
        name: 'Migraine / Neurological Observation',
        desc: 'Severe headaches or recurring morning vomiting. May be benign migraines, but persistent cases require scanning.',
        symptoms: ['headaches', 'headaches_vomiting', 'vomiting_morning', 'fatigue', 'decline', 'vomiting'],
        color: '#f43f5e'
    }
];

let selectedSymptoms = new Set();
let currentAgeGroup = '3-6';

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="age-group"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentAgeGroup = e.target.value;
            renderSymptoms();
            resetAll(false); // Reset without resetting the age radio
        });
        
        // Find initially checked
        if(radio.checked) {
            currentAgeGroup = radio.value;
        }
    });

    renderSymptoms();
    document.getElementById('reset-btn').addEventListener('click', () => resetAll(true));
});

function renderSymptoms() {
    const listContainer = document.getElementById('symptoms-list');
    listContainer.innerHTML = '';
    
    const symptomsToRender = symptomsByAge[currentAgeGroup] || [];
    
    symptomsToRender.forEach((symptomId) => {
        const symptom = allSymptoms[symptomId];
        const div = document.createElement('div');
        div.className = 'symptom-item';
        if(selectedSymptoms.has(symptomId)) div.classList.add('active');
        div.dataset.id = symptomId;
        
        div.innerHTML = `
            <div class="checkbox-wrapper">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="symptom-info">
                <h4>${symptom.name}</h4>
                <p>${symptom.desc}</p>
            </div>
        `;
        
        div.addEventListener('click', () => toggleSymptom(symptomId, div));
        listContainer.appendChild(div);
    });
}

function toggleSymptom(id, el) {
    if (selectedSymptoms.has(id)) {
        selectedSymptoms.delete(id);
        el.classList.remove('active');
    } else {
        selectedSymptoms.add(id);
        el.classList.add('active');
    }
    
    updateAnalysis();
}

function resetAll(resetAge = true) {
    selectedSymptoms.clear();
    document.querySelectorAll('.symptom-item').forEach(el => el.classList.remove('active'));
    
    if (resetAge) {
        const defaultAge = document.querySelector('input[name="age-group"][value="3-6"]');
        if (defaultAge) {
            defaultAge.checked = true;
            currentAgeGroup = '3-6';
            renderSymptoms();
        }
    }

    updateAnalysis();
}

function updateAnalysis() {
    const activeSymptoms = symptomsByAge[currentAgeGroup] || [];
    const totalPossibleWeight = activeSymptoms.reduce((acc, currId) => acc + allSymptoms[currId].weight, 0);
    let currentWeight = 0;
    
    selectedSymptoms.forEach(id => {
        if (allSymptoms[id]) currentWeight += allSymptoms[id].weight;
    });

    // Calculate percentage (0-100)
    const percentage = Math.min(100, totalPossibleWeight === 0 ? 0 : Math.round((currentWeight / totalPossibleWeight) * 100));
    
    updateGauge(percentage);
    updateExplainableAI();
    updateDifferentialDiagnosis();
    updateConclusion(percentage);

    // Emergency Routing Logic (75% or above)
    if (percentage >= 75) {
        if (!window.emergencyRedirectTimeout) {
            window.emergencyRedirectTimeout = setTimeout(() => {
                alert('High-Risk Cancer Symptoms Detected (75%+). Redirecting to Emergency Help & Support for nearby hospitals.');
                window.location.href = 'help.html';
            }, 1200); // Wait 1.2s to show the red gauge
        }
    } else {
        if (window.emergencyRedirectTimeout) {
            clearTimeout(window.emergencyRedirectTimeout);
            window.emergencyRedirectTimeout = null;
        }
    }
}

function updateExplainableAI() {
    const featureContainer = document.getElementById('feature-importance');
    if(!featureContainer) return;

    if (selectedSymptoms.size === 0) {
        featureContainer.innerHTML = `
            <div class="empty-state" style="margin-top:10px; padding:15px;">
                <p style="font-size: 0.9rem; color: #666;">Provide symptoms to see the model explanation.</p>
            </div>`;
        return;
    }

    // Sort selected symptoms by weight
    let activeFeatures = Array.from(selectedSymptoms).map(id => {
        return { id, name: allSymptoms[id].name, weight: allSymptoms[id].weight };
    }).sort((a, b) => b.weight - a.weight);

    let maxWeight = Math.max(...Object.values(allSymptoms).map(s => s.weight));

    featureContainer.innerHTML = '';
    activeFeatures.forEach(feature => {
        const fillPercent = (feature.weight / maxWeight) * 100;
        let color = 'var(--primary)';
        if(feature.weight >= 2) color = 'var(--danger)';
        else if(feature.weight > 1) color = 'var(--warning)';
        else color = 'var(--accent)';

        featureContainer.innerHTML += `
            <div class="feature-bar">
                <div class="feature-name" title="${feature.name}">${feature.name}</div>
                <div class="feature-track">
                    <div class="feature-fill" style="width: ${fillPercent}%; background: ${color};"></div>
                </div>
                <div class="feature-val">${feature.weight.toFixed(1)}</div>
            </div>
        `;
    });
}

function updateConclusion(percentage) {
    const panel = document.getElementById('conclusion-panel');
    const textEl = document.getElementById('conclusion-text');
    if(!panel || !textEl) return;

    if(percentage === 0) {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = 'block';

    if (percentage > 70) {
        textEl.innerHTML = `<strong style="color:var(--danger)">High Urgency Recommended:</strong> Multiple severe red-flag symptoms detected. Please consult a pediatric oncologist or your primary care pediatrician immediately for blood tests and further evaluation.`;
        panel.style.borderLeft = "5px solid var(--danger)";
    } else if (percentage > 40) {
        textEl.innerHTML = `<strong style="color:var(--warning)">Moderate Evaluation Advised:</strong> The combination of symptoms warrants a medical checkup to rule out infections, anemia, or potential early-onset conditions.`;
        panel.style.borderLeft = "5px solid var(--warning)";
    } else {
        textEl.innerHTML = `<strong style="color:var(--accent)">Routine Observation:</strong> Low overlap with malignancy indicators. Symptoms are likely related to benign childhood illnesses. Maintain routine pediatrician visits.`;
        panel.style.borderLeft = "5px solid var(--accent)";
    }
}

function updateGauge(percentage) {
    const gaugeFill = document.getElementById('gauge-fill');
    const gaugeValue = document.getElementById('gauge-value');
    const riskLabel = document.getElementById('risk-label');
    if(!gaugeFill) return;
    
    // Circumference of half circle with r=40 is ~125.6
    const circumference = 125.6;
    const offset = circumference - (percentage / 100) * circumference;
    
    gaugeFill.style.strokeDashoffset = offset;
    
    // Animate numbers
    let start = parseInt(gaugeValue.innerText) || 0;
    animateValue(gaugeValue, start, percentage, 500);
    
    // Color coding based on risk layers
    let color = 'var(--accent)'; // Green
    let text = 'Low Risk';
    
    if (percentage > 70) {
        color = 'var(--danger)'; // Red
        text = 'High Risk (Consult MD)';
    } else if (percentage > 40) {
        color = 'var(--warning)'; // Orange
        text = 'Medium Risk';
    } else if (percentage > 0) {
        color = 'var(--primary)'; // Blue
        text = 'Mild Symptoms';
    }
    
    gaugeFill.style.stroke = color;
    riskLabel.style.color = color;
    riskLabel.innerText = text;
}

function updateDifferentialDiagnosis() {
    const container = document.getElementById('disease-list');
    if(!container) return;
    
    if (selectedSymptoms.size === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-hand-pointer"></i>
                <p>Select symptoms to view potential common diagnoses.</p>
            </div>
        `;
        return;
    }

    // Calculate matches for diseases
    const matches = diseasesDatabase.map(disease => {
        const matchedSymptoms = disease.symptoms.filter(symp => selectedSymptoms.has(symp));
        const matchCount = matchedSymptoms.length;
        const score = matchCount > 0 ? (matchCount / disease.symptoms.length) * 100 : 0;
        
        return {
            ...disease,
            matchedSymptoms,
            score
        };
    }).filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="border-color: #fca5a5; background: rgba(254, 226, 226, 0.7);">
                <i class="fa-solid fa-notes-medical" style="color: #ef4444;"></i>
                <p style="color: #b91c1c;">No direct common benign matches for this exact combination. Please consult a healthcare professional for a checkup.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    
    // Render sorted matches
    matches.forEach((match, index) => {
        const matchTags = match.matchedSymptoms.map(id => {
            const sympName = allSymptoms[id] ? allSymptoms[id].name : id;
            return `<span class="match-tag"><i class="fa-solid fa-check" style="color:var(--accent);"></i> ${sympName}</span>`;
        }).join('');

        const el = document.createElement('div');
        el.className = 'disease-card';
        el.style.borderLeftColor = match.color;
        el.style.animationDelay = `${index * 0.1}s`;
        
        el.innerHTML = `
            <div class="disease-header">
                <h4>${match.name}</h4>
                <span class="match-score" style="background-color: ${match.color}">${Math.round(match.score)}% Match</span>
            </div>
            <p class="disease-desc">${match.desc}</p>
            <div class="matching-symptoms">
                ${matchTags}
            </div>
        `;
        
        container.appendChild(el);
    });
}

// Function to animate number counting up/down smoothly
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '%';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
