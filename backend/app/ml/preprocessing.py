from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

def build_school_preprocessor(include_period_grades: bool = True):
    numerical_features = ['absences', 'failures', 'Medu', 'Fedu', 'goout', 'health']
    if include_period_grades:
        numerical_features.extend(['G1', 'G2'])

    categorical_features = ['higher', 'schoolsup', 'famsup', 'internet']
    ordinal_features = ['studytime']

    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', drop='first'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, numerical_features),
            ('cat', cat_pipeline, categorical_features),
            ('ord', StandardScaler(), ordinal_features)
        ],
        remainder='drop'
    )
    return preprocessor

def build_college_preprocessor():
    ordinal_features = [
        'CGPA_LAST', 'ATTENDANCE_CLASSES', 'WEEKLY_STUDY_HOURS',
        'PREP_MIDTERM_1', 'TAKING_NOTES', 'LISTEN_CLASS',
        'DISCUSSION_INTEREST', 'SCHOLARSHIP', 'PROJECT_IMPACT'
    ]
    categorical_features = ['ADDITIONAL_WORK']

    return ColumnTransformer(
        transformers=[
            ('ord', StandardScaler(), ordinal_features),
            ('cat', OneHotEncoder(drop='first'), categorical_features)
        ]
    )
